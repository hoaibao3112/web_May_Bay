import { IsNotEmpty, IsNumber, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateAirportTransferBookingDto {
    @IsNotEmpty()
    @IsNumber()
    dichVuId: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsIn(['mot_chieu', 'khu_hoi'])
    loaiDichVu: 'mot_chieu' | 'khu_hoi';

    // Pickup trip info
    @IsNotEmpty()
    @IsString()
    ngayDon: string; // ISO date

    @IsOptional()
    @IsString()
    gioDon?: string; // HH:mm

    @IsNotEmpty()
    @IsString()
    diemDon: string;

    @IsNotEmpty()
    @IsString()
    diemTra: string;

    @IsNotEmpty()
    @IsNumber()
    soHanhKhach: number;

    // Return trip info (for round trip)
    @IsOptional()
    @IsString()
    ngayTra?: string;

    @IsOptional()
    @IsString()
    gioTra?: string;

    // Contact info
    @IsNotEmpty()
    @IsString()
    tenKhachHang: string;

    @IsNotEmpty()
    @IsString()
    soDienThoai: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    ghiChu?: string;
}
