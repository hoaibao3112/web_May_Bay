import { IsInt, IsString, IsEnum } from 'class-validator';

export enum PhuongThucThanhToan {
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  ZALOPAY = 'ZALOPAY',
  ATM = 'ATM',
  QR = 'QR',
}

export class CreatePaymentDto {
  @IsInt()
  bookingId: number;

  @IsEnum(PhuongThucThanhToan)
  phuongThuc: PhuongThucThanhToan;
}
