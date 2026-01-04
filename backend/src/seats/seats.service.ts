import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  // Lấy sơ đồ ghế của chuyến bay
  async getSeatMap(changBayId: number) {
    const changBay = await this.prisma.changBay.findUnique({
      where: { id: changBayId },
      include: {
        chuyenBay: {
          include: { hang: true },
        },
      },
    });

    if (!changBay) {
      throw new NotFoundException('Không tìm thấy chặng bay');
    }

    // Lấy danh sách ghế đã được chọn
    const bookedSeats = await this.prisma.hanhKhach.findMany({
      where: {
        donDatVe: {
          changBayId: changBayId,
          trangThai: { in: ['CHO_THANH_TOAN', 'DA_THANH_TOAN'] },
        },
        soGhe: { not: null },
      },
      select: {
        soGhe: true,
      },
    });

    const bookedSeatNumbers = bookedSeats.map((s) => s.soGhe);

    // Generate sơ đồ ghế mẫu (có thể lưu trong DB nếu cần)
    const seatMap = this.generateSeatMap();

    // Đánh dấu ghế đã được đặt
    seatMap.forEach((row) => {
      row.forEach((seat) => {
        if (bookedSeatNumbers.includes(seat.number)) {
          seat.available = false;
        }
      });
    });

    return {
      changBayId,
      soHieuChuyenBay: changBay.chuyenBay.soHieuChuyenBay,
      hangHangKhong: changBay.chuyenBay.hang.tenHang,
      seatMap,
    };
  }

  // Chọn ghế cho hành khách
  async selectSeat(hanhKhachId: number, soGhe: string) {
    const hanhKhach = await this.prisma.hanhKhach.findUnique({
      where: { id: hanhKhachId },
      include: {
        donDatVe: true,
      },
    });

    if (!hanhKhach) {
      throw new NotFoundException('Không tìm thấy hành khách');
    }

    // Kiểm tra ghế đã được chọn chưa
    const existingSeat = await this.prisma.hanhKhach.findFirst({
      where: {
        soGhe: soGhe,
        donDatVe: {
          changBayId: hanhKhach.donDatVe.changBayId,
          trangThai: { in: ['CHO_THANH_TOAN', 'DA_THANH_TOAN'] },
        },
      },
    });

    if (existingSeat) {
      throw new BadRequestException('Ghế này đã được chọn');
    }

    // Cập nhật số ghế
    const updated = await this.prisma.hanhKhach.update({
      where: { id: hanhKhachId },
      data: { soGhe: soGhe },
    });

    return {
      message: 'Chọn ghế thành công',
      hanhKhachId,
      soGhe: updated.soGhe,
    };
  }

  // Lấy ghế đã chọn của booking
  async getBookingSeats(bookingId: number) {
    const seats = await this.prisma.hanhKhach.findMany({
      where: {
        donDatVeId: bookingId,
        soGhe: { not: null },
      },
      select: {
        id: true,
        ho: true,
        ten: true,
        soGhe: true,
      },
    });

    return seats;
  }

  // Hủy chọn ghế
  async cancelSeat(hanhKhachId: number) {
    await this.prisma.hanhKhach.update({
      where: { id: hanhKhachId },
      data: { soGhe: null },
    });

    return { message: 'Đã hủy chọn ghế' };
  }

  // Kiểm tra số ghế còn trống
  async checkAvailability(changBayId: number) {
    const bookedSeats = await this.prisma.hanhKhach.count({
      where: {
        donDatVe: {
          changBayId: changBayId,
          trangThai: { in: ['CHO_THANH_TOAN', 'DA_THANH_TOAN'] },
        },
        soGhe: { not: null },
      },
    });

    const totalSeats = 180; // Mẫu 180 ghế
    const availableSeats = totalSeats - bookedSeats;

    return {
      tongSoGhe: totalSeats,
      gheDaDat: bookedSeats,
      gheConTrong: availableSeats,
    };
  }

  // Generate sơ đồ ghế mẫu (A320: 30 hàng, mỗi hàng 6 ghế: ABC DEF)
  private generateSeatMap() {
    const rows = 30;
    const seatsPerRow = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatMap = [];

    for (let row = 1; row <= rows; row++) {
      const rowSeats = seatsPerRow.map((letter) => ({
        number: `${row}${letter}`,
        available: true,
        type: row <= 3 ? 'business' : row <= 10 ? 'premium' : 'economy',
        extraLegroom: row === 11 || row === 23, // Exit rows
      }));
      seatMap.push(rowSeats);
    }

    return seatMap;
  }
}
