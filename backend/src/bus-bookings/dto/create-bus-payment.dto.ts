import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBusPaymentDto {
    @IsNotEmpty({ message: 'Mã đơn đặt không được để trống' })
    @IsNumber({}, { message: 'Mã đơn đặt phải là số' })
    @Type(() => Number)
    bookingId: number;

    @IsNotEmpty()
    @IsString()
    phuongThuc: string; // 'VIET_QR' | 'VIETTEL_PAY' | 'DIGITAL_WALLET' | 'CHUYEN_KHOAN' | 'THE_TIN_DUNG' | 'TRA_GOP'
}

export class VerifyBusPaymentDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    bookingId: number;

    @IsNotEmpty()
    @IsString()
    maGiaoDich: string;

    @IsNotEmpty()
    @IsString()
    trangThai: 'THANH_CONG' | 'THAT_BAI' | 'HUY';
}
