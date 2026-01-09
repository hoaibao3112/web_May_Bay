import { IsInt, IsString, IsEmail, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateActivityBookingDto {
    @IsInt()
    hoatDongId: number;

    @IsString()
    hoTen: string;

    @IsEmail()
    email: string;

    @IsString()
    soDienThoai: string;

    @IsDateString()
    ngayThucHien: string;

    @IsInt()
    @Min(1)
    soNguoiLon: number;

    @IsInt()
    @Min(0)
    soTreEm: number;

    @IsOptional()
    @IsString()
    ghiChu?: string;

    @IsOptional()
    @IsString()
    phuongThucThanhToan?: string; // 'MOMO' | 'VIETQR' | 'ZALOPAY'
}
