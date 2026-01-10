import { IsInt, IsString, IsEmail, IsDateString, IsOptional, Min, IsEnum } from 'class-validator';

export class CreateHotelBookingDto {
    @IsInt()
    khachSanId: number;

    @IsInt()
    phongId: number;

    @IsString()
    hoTen: string;

    @IsEmail()
    email: string;

    @IsString()
    soDienThoai: string;

    @IsDateString()
    ngayNhanPhong: string;

    @IsDateString()
    ngayTraPhong: string;

    @IsInt()
    @Min(1)
    soDem: number;

    @IsInt()
    @Min(1)
    soNguoi: number;

    @IsInt()
    @Min(1)
    soPhong: number;

    @IsOptional()
    @IsString()
    ghiChu?: string;

    @IsOptional()
    @IsEnum(['MOMO', 'VIETQR', 'ZALOPAY', 'VNPAY'])
    phuongThucThanhToan?: string;
}
