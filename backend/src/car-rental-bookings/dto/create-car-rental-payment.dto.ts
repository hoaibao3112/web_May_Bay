import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarRentalPaymentDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    donThueXeId: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    soTien: number;

    @IsNotEmpty()
    @IsString()
    phuongThuc: string; // VNPAY, MOMO, ZALOPAY, etc.

    @IsOptional()
    @IsString()
    returnUrl?: string;
}

export class VerifyCarRentalPaymentDto {
    @IsNotEmpty()
    @IsString()
    maGiaoDich: string;

    @IsNotEmpty()
    @IsString()
    trangThai: string; // THANH_CONG, THAT_BAI

    @IsOptional()
    thongTinGiaoDich?: any;
}
