export class CreateHotelBookingDto {
    khachSanId: number;
    userId: number;
    phongId: number;
    ngayNhanPhong: Date;
    ngayTraPhong: Date;
    soLuongPhong: number;
    soNguoiLon: number;
    soTreEm: number;
    tenKhachHang: string;
    email: string;
    soDienThoai: string;
    yeuCauDacBiet?: string;
}
