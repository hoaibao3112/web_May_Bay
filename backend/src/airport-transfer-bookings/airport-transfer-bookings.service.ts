import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAirportTransferBookingDto } from './dto/create-airport-transfer-booking.dto';
import { CreateAirportTransferPaymentDto } from './dto/create-airport-transfer-payment.dto';

@Injectable()
export class AirportTransferBookingsService {
    constructor(private prisma: PrismaService) { }

    async createBooking(createBookingDto: CreateAirportTransferBookingDto) {
        const {
            dichVuId,
            userId,
            loaiDichVu,
            ngayDon,
            gioDon,
            diemDon,
            diemTra,
            soHanhKhach,
            ngayTra,
            gioTra,
            tenKhachHang,
            soDienThoai,
            email,
            ghiChu,
        } = createBookingDto;

        // DEBUG: Log the received data
        console.log('📥 Received dichVuId:', dichVuId);

        // Get service details to calculate price
        const service: any = await this.prisma.$queryRaw`
            SELECT * FROM dich_vu_dua_don WHERE id = ${dichVuId}
        `;

        // DEBUG: Log query result
        console.log('📊 Query result:', service);
        console.log('📊 Service found:', service && service.length > 0 ? 'YES' : 'NO');

        if (!service || service.length === 0) {
            throw new Error('Dịch vụ không tồn tại');
        }

        const serviceData = service[0];

        // Validate passenger capacity
        if (soHanhKhach > serviceData.soChoNgoi) {
            throw new Error(`Dịch vụ chỉ phục vụ tối đa ${serviceData.soChoNgoi} hành khách`);
        }

        // Calculate total price
        let tongTien: number;
        if (loaiDichVu === 'khu_hoi') {
            if (!serviceData.giaTienKhuHoi) {
                throw new Error('Dịch vụ không hỗ trợ khứ hồi');
            }
            tongTien = parseFloat(serviceData.giaTienKhuHoi);
        } else {
            tongTien = parseFloat(serviceData.giaTienMotChieu);
        }

        // Combine date and time for pickup
        let ngayDonDateTime = new Date(ngayDon);
        if (gioDon) {
            const [hours, minutes] = gioDon.split(':');
            ngayDonDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }

        // Combine date and time for return (if round trip)
        let ngayTraDateTime = null;
        if (loaiDichVu === 'khu_hoi' && ngayTra) {
            ngayTraDateTime = new Date(ngayTra);
            if (gioTra) {
                const [hours, minutes] = gioTra.split(':');
                ngayTraDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            }
        }

        // Create booking
        const booking: any = await this.prisma.$queryRaw`
            INSERT INTO dat_dich_vu_dua_don (
                dichVuId, userId, loaiDichVu,
                ngayDon, diemDon, diemTra, soHanhKhach,
                ngayTra,
                tenKhachHang, soDienThoai, email, ghiChu,
                tongTien, trangThaiThanhToan, trangThai,
                createdAt, updatedAt
            ) VALUES (
                ${dichVuId}, ${userId}, ${loaiDichVu},
                ${ngayDonDateTime}, ${diemDon}, ${diemTra}, ${soHanhKhach},
                ${ngayTraDateTime},
                ${tenKhachHang}, ${soDienThoai}, ${email}, ${ghiChu},
                ${tongTien}, 'pending', 'pending',
                NOW(), NOW()
            )
        `;

        // Get the inserted booking ID
        const result: any = await this.prisma.$queryRaw`
            SELECT LAST_INSERT_ID() as id
        `;

        const bookingId = result[0].id;

        // DEBUG: Log the created booking ID
        console.log('✅ Booking created with ID:', bookingId);

        const createdBooking = await this.getBookingById(bookingId);
        console.log('✅ Retrieved booking:', createdBooking ? 'SUCCESS' : 'FAILED');

        return createdBooking;
    }

    async getBookingById(id: number) {
        const booking: any = await this.prisma.$queryRaw`
            SELECT 
                db.*,
                dv.loaiXe,
                dv.soChoNgoi,
                dv.giaTienMotChieu,
                dv.giaTienKhuHoi,
                ncc.tenNhaCungCap,
                ncc.logo,
                ncc.soDienThoai as soDienThoaiNhaCungCap,
                ncc.email as emailNhaCungCap,
                sb.tenSanBay,
                sb.maSanBay,
                sb.thanhPho
            FROM dat_dich_vu_dua_don db
            JOIN dich_vu_dua_don dv ON db.dichVuId = dv.id
            JOIN nha_cung_cap_dua_don ncc ON dv.nhaCungCapId = ncc.id
            JOIN san_bay sb ON dv.sanBayId = sb.id
            WHERE db.id = ${id}
        `;

        if (!booking || booking.length === 0) {
            throw new Error('Không tìm thấy đặt chỗ');
        }

        const result = booking[0];

        return {
            id: result.id,
            dichVu: {
                id: result.dichVuId,
                loaiXe: result.loaiXe,
                soChoNgoi: result.soChoNgoi,
                giaTienMotChieu: parseFloat(result.giaTienMotChieu),
                giaTienKhuHoi: result.giaTienKhuHoi ? parseFloat(result.giaTienKhuHoi) : null,
            },
            nhaCungCap: {
                ten: result.tenNhaCungCap,
                logo: result.logo,
                soDienThoai: result.soDienThoaiNhaCungCap,
                email: result.emailNhaCungCap,
            },
            sanBay: {
                ten: result.tenSanBay,
                ma: result.maSanBay,
                thanhPho: result.thanhPho,
            },
            loaiDichVu: result.loaiDichVu,
            ngayDon: result.ngayDon,
            diemDon: result.diemDon,
            diemTra: result.diemTra,
            soHanhKhach: result.soHanhKhach,
            ngayTra: result.ngayTra,
            tenKhachHang: result.tenKhachHang,
            soDienThoai: result.soDienThoai,
            email: result.email,
            ghiChu: result.ghiChu,
            tongTien: parseFloat(result.tongTien),
            trangThaiThanhToan: result.trangThaiThanhToan,
            phuongThucThanhToan: result.phuongThucThanhToan,
            trangThai: result.trangThai,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    }

    async getBookingsByUserId(userId: number) {
        const bookings: any = await this.prisma.$queryRaw`
            SELECT 
                db.*,
                dv.loaiXe,
                ncc.tenNhaCungCap,
                ncc.logo,
                sb.tenSanBay,
                sb.maSanBay
            FROM dat_dich_vu_dua_don db
            JOIN dich_vu_dua_don dv ON db.dichVuId = dv.id
            JOIN nha_cung_cap_dua_don ncc ON dv.nhaCungCapId = ncc.id
            JOIN san_bay sb ON dv.sanBayId = sb.id
            WHERE db.userId = ${userId}
            ORDER BY db.createdAt DESC
        `;

        return bookings.map((booking: any) => ({
            id: booking.id,
            nhaCungCap: {
                ten: booking.tenNhaCungCap,
                logo: booking.logo,
            },
            sanBay: {
                ten: booking.tenSanBay,
                ma: booking.maSanBay,
            },
            loaiXe: booking.loaiXe,
            loaiDichVu: booking.loaiDichVu,
            ngayDon: booking.ngayDon,
            diemDon: booking.diemDon,
            diemTra: booking.diemTra,
            tongTien: parseFloat(booking.tongTien),
            trangThaiThanhToan: booking.trangThaiThanhToan,
            trangThai: booking.trangThai,
            createdAt: booking.createdAt,
        }));
    }

    async updateBookingStatus(id: number, trangThai: string) {
        // Validate status
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(trangThai)) {
            throw new Error('Trạng thái không hợp lệ');
        }

        // Update booking status
        await this.prisma.$queryRaw`
            UPDATE dat_dich_vu_dua_don 
            SET trangThai = ${trangThai}, updatedAt = NOW()
            WHERE id = ${id}
        `;

        return this.getBookingById(id);
    }

    async cancelBooking(id: number, userId: number) {
        // Verify booking belongs to user
        const booking: any = await this.prisma.$queryRaw`
            SELECT * FROM dat_dich_vu_dua_don 
            WHERE id = ${id} AND userId = ${userId}
        `;

        if (!booking || booking.length === 0) {
            throw new Error('Không tìm thấy đặt chỗ');
        }

        const bookingData = booking[0];

        // Check if booking can be cancelled
        if (bookingData.trangThai === 'completed') {
            throw new Error('Không thể hủy đặt chỗ đã hoàn thành');
        }

        if (bookingData.trangThai === 'cancelled') {
            throw new Error('Đặt chỗ đã được hủy trước đó');
        }

        // Update booking status
        await this.prisma.$queryRaw`
            UPDATE dat_dich_vu_dua_don 
            SET trangThai = 'cancelled', updatedAt = NOW()
            WHERE id = ${id}
        `;

        return { message: 'Hủy đặt chỗ thành công' };
    }

    async processPayment(paymentDto: CreateAirportTransferPaymentDto) {
        const { bookingId, phuongThucThanhToan, soTien } = paymentDto;

        // DEBUG: Log payment request
        console.log('💳 Processing payment for booking ID:', bookingId);
        console.log('💳 Payment data:', paymentDto);

        // Get booking details
        const booking: any = await this.prisma.$queryRaw`
            SELECT * FROM dat_dich_vu_dua_don WHERE id = ${bookingId}
        `;

        // DEBUG: Log query result
        console.log('💳 Booking query result:', booking);
        console.log('💳 Booking found:', booking && booking.length > 0 ? 'YES' : 'NO');

        if (!booking || booking.length === 0) {
            throw new Error('Không tìm thấy đặt chỗ');
        }

        const bookingData = booking[0];

        // Check if already paid
        if (bookingData.trangThaiThanhToan === 'paid') {
            throw new Error('Đặt chỗ đã được thanh toán');
        }

        // Verify amount
        if (parseFloat(bookingData.tongTien) !== soTien) {
            throw new Error('Số tiền thanh toán không khớp');
        }

        // Generate transaction code
        const maGiaoDich = `${phuongThucThanhToan.toUpperCase()}${Date.now()}${bookingId}`;

        // Create payment record
        await this.prisma.$queryRaw`
            INSERT INTO thanh_toan_dua_don (
                datDichVuId, soTien, phuongThucThanhToan, 
                trangThai, maGiaoDich, thoiGianThanhToan,
                moTa, createdAt, updatedAt
            ) VALUES (
                ${bookingId}, ${soTien}, ${phuongThucThanhToan},
                'completed', ${maGiaoDich}, NOW(),
                'Thanh toán thành công', NOW(), NOW()
            )
        `;

        // Update booking payment status
        await this.prisma.$queryRaw`
            UPDATE dat_dich_vu_dua_don 
            SET 
                trangThaiThanhToan = 'paid',
                phuongThucThanhToan = ${phuongThucThanhToan},
                trangThai = 'confirmed',
                updatedAt = NOW()
            WHERE id = ${bookingId}
        `;

        return {
            message: 'Thanh toán thành công',
            bookingId,
            maGiaoDich,
            soTien,
            phuongThucThanhToan,
            thoiGianThanhToan: new Date(),
        };
    }

    async getPaymentsByBookingId(bookingId: number) {
        const payments: any = await this.prisma.$queryRaw`
            SELECT * FROM thanh_toan_dua_don 
            WHERE datDichVuId = ${bookingId}
            ORDER BY createdAt DESC
        `;

        return payments.map((payment: any) => ({
            id: payment.id,
            soTien: parseFloat(payment.soTien),
            phuongThucThanhToan: payment.phuongThucThanhToan,
            trangThai: payment.trangThai,
            maGiaoDich: payment.maGiaoDich,
            maGiaoDichNganHang: payment.maGiaoDichNganHang,
            nganHang: payment.nganHang,
            moTa: payment.moTa,
            thoiGianThanhToan: payment.thoiGianThanhToan,
            createdAt: payment.createdAt,
        }));
    }
}
