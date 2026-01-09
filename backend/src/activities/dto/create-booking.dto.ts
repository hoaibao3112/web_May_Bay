import { IsInt, IsString, IsDateString, IsEmail, IsPhoneNumber, IsOptional, Min } from 'class-validator';

export class CreateBookingDto {
    @IsInt()
    hoatDongId: number;

    @IsOptional()
    @IsInt()
    lichHoatDongId?: number;

    @IsDateString()
    ngayThucHien: string;

    @IsInt()
    @Min(1)
    soNguoiLon: number;

    @IsInt()
    @Min(0)
    soTreEm: number = 0;

    @IsString()
    hoTen: string;

    @IsEmail()
    email: string;

    @IsString()
    soDienThoai: string;

    @IsOptional()
    @IsString()
    ghiChu?: string;
}
