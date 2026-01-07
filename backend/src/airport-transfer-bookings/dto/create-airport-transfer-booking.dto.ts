export class CreateAirportTransferBookingDto {
    dichVuId: number;
    userId: number;
    loaiDichVu: 'mot_chieu' | 'khu_hoi';

    // Pickup trip info
    ngayDon: string; // ISO date
    gioDon?: string; // HH:mm
    diemDon: string;
    diemTra: string;
    soHanhKhach: number;

    // Return trip info (for round trip)
    ngayTra?: string;
    gioTra?: string;

    // Contact info
    tenKhachHang: string;
    soDienThoai: string;
    email?: string;
    ghiChu?: string;
}
