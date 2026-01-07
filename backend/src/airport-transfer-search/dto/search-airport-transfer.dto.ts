export class SearchAirportTransferDto {
    sanBayId: number;
    ngayDon: string; // ISO date string
    gioDon?: string; // HH:mm format
    soHanhKhach: number;
    loaiXe?: 'sedan' | 'suv' | 'van' | 'minibus' | 'limousine';
    diemDon?: string;
    diemTra?: string;
    loaiDichVu?: 'mot_chieu' | 'khu_hoi';
    ngayTra?: string; // For round trip
    giaMin?: number;
    giaMax?: number;
    nhaCungCapId?: number;
}
