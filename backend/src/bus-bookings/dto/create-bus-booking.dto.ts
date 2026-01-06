export class CreateBusBookingDto {
    chuyenXeId: number;
    soLuongGhe: number;
    danhSachGhe: string[]; // ["A1", "A2"]
    hanhKhach: PassengerDto[];
    ghiChu?: string;
}

export class PassengerDto {
    hoTenHanhKhach: string;
    soDienThoai?: string;
    email?: string;
    soGhe: string;
}
