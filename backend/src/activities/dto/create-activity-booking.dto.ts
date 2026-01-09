import { IsInt, IsString, IsEmail, IsDateString, IsOptional, Min, IsEnum } from 'class-validator';
import { PhuongThucThanhToan } from '../entities/dat-hoat-dong.entity';

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
    @IsEnum(PhuongThucThanhToan)
    phuongThucThanhToan?: PhuongThucThanhToan;
}
