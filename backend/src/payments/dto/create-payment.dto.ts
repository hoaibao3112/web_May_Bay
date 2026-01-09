import { IsInt, IsString, IsEnum } from 'class-validator';

export enum PaymentMethod {
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  VIETQR = 'VIETQR',
  ZALOPAY = 'ZALOPAY',
  ATM = 'ATM',
  QR = 'QR',
}

export class CreatePaymentDto {
  @IsInt()
  bookingId: number;

  @IsEnum(PaymentMethod)
  phuongThuc: PaymentMethod;
}
