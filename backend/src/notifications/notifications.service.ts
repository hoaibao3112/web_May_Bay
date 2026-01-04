import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // Gửi thông báo cập nhật chuyến bay
  async sendFlightUpdate(
    changBayId: number,
    loaiThongBao: string,
    noiDung: string,
    gioMoi?: Date,
    congMoi?: string,
  ) {
    // Lấy tất cả bookings của chặng bay này
    const bookings = await this.prisma.donDatVe.findMany({
      where: {
        changBayId: changBayId,
        trangThai: { in: ['CHO_THANH_TOAN', 'DA_THANH_TOAN'] },
      },
      include: {
        thongTinLienHe: true,
        changBay: {
          include: {
            chuyenBay: {
              include: { hang: true },
            },
            sanBayDi: true,
            sanBayDen: true,
          },
        },
      },
    });

    if (bookings.length === 0) {
      throw new NotFoundException('Không tìm thấy booking nào cho chặng bay này');
    }

    const changBay = bookings[0].changBay;

    // Tạo thông báo cho mỗi user
    const notifications = [];
    for (const booking of bookings) {
      if (booking.nguoiDungId) {
        const notification = await this.prisma.thongBao.create({
          data: {
            nguoiDungId: booking.nguoiDungId,
            loai: loaiThongBao,
            tieuDe: this.getNotificationTitle(loaiThongBao, changBay.chuyenBay.soHieuChuyenBay),
            noiDung: noiDung,
            lienKet: `/bookings/${booking.id}`,
            daDo: false,
          },
        });
        notifications.push(notification);
      }

      // TODO: Gửi email thông báo đến booking.thongTinLienHe.email
      // TODO: Gửi SMS nếu có số điện thoại
    }

    // Cập nhật thông tin chặng bay nếu có thay đổi
    const updateData: any = {};
    if (gioMoi) {
      updateData.gioDi = gioMoi;
    }

    if (Object.keys(updateData).length > 0) {
      await this.prisma.changBay.update({
        where: { id: changBayId },
        data: updateData,
      });
    }

    return {
      message: 'Đã gửi thông báo thành công',
      soLuongThongBao: notifications.length,
      loaiThongBao,
    };
  }

  // Lấy thông báo của user
  async getUserNotifications(userId: number, page: number) {
    const limit = 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.thongBao.findMany({
        where: { nguoiDungId: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.thongBao.count({
        where: { nguoiDungId: userId },
      }),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      notifications: notifications.map((n) => ({
        id: n.id,
        loai: n.loai,
        tieuDe: n.tieuDe,
        noiDung: n.noiDung,
        lienKet: n.lienKet,
        daDo: n.daDo,
        ngayTao: n.createdAt,
      })),
    };
  }

  // Đánh dấu đã đọc
  async markAsRead(notificationId: number) {
    await this.prisma.thongBao.update({
      where: { id: notificationId },
      data: { daDo: true },
    });

    return { message: 'Đã đánh dấu đọc' };
  }

  // Đánh dấu tất cả đã đọc
  async markAllAsRead(userId: number) {
    await this.prisma.thongBao.updateMany({
      where: {
        nguoiDungId: userId,
        daDo: false,
      },
      data: { daDo: true },
    });

    return { message: 'Đã đánh dấu tất cả đã đọc' };
  }

  // Lấy số thông báo chưa đọc
  async getUnreadCount(userId: number) {
    const count = await this.prisma.thongBao.count({
      where: {
        nguoiDungId: userId,
        daDo: false,
      },
    });

    return { unreadCount: count };
  }

  // Lấy thông báo theo booking
  async getBookingNotifications(bookingId: number) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: bookingId },
    });

    if (!booking || !booking.nguoiDungId) {
      return { notifications: [] };
    }

    const notifications = await this.prisma.thongBao.findMany({
      where: {
        nguoiDungId: booking.nguoiDungId,
        lienKet: { contains: `/bookings/${bookingId}` },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      bookingId,
      notifications,
    };
  }

  // Helper: Tạo tiêu đề thông báo
  private getNotificationTitle(loaiThongBao: string, soHieuChuyenBay: string): string {
    const titles: Record<string, string> = {
      DELAY: `⏰ Chuyến bay ${soHieuChuyenBay} bị hoãn`,
      CANCELLED: `❌ Chuyến bay ${soHieuChuyenBay} đã bị hủy`,
      GATE_CHANGE: `🚪 Thay đổi cổng bay cho chuyến ${soHieuChuyenBay}`,
      ON_TIME: `✅ Chuyến bay ${soHieuChuyenBay} đúng giờ`,
    };
    return titles[loaiThongBao] || `Cập nhật chuyến bay ${soHieuChuyenBay}`;
  }
}
