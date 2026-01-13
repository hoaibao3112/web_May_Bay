import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateHotelBookingDto {
    @IsNumber()
    khachSanId: number;

    @IsNumber()
    phongId: number;

    @IsDateString()
    ngayNhanPhong: Date;

    @IsDateString()
    ngayTraPhong: Date;

    @IsNumber()
    soLuongPhong: number;

    @IsNumber()
    soNguoiLon: number;

    @IsNumber()
    soTreEm: number;

    @IsString()
    tenKhachHang: string;

    @IsString()
    email: string;

    @IsString()
    soDienThoai: string;

    @IsOptional()
    @IsString()
    yeuCauDacBiet?: string;
}
