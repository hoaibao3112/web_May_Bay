import { IsInt, IsString, IsEnum } from 'class-validator';

export enum PhuongThucThanhToan {
  THE = 'THE',
  ATM = 'ATM',
  VI = 'VI',
  QR = 'QR',
}

export class CreatePaymentDto {
  @IsInt()
  bookingId: number;

  @IsEnum(PhuongThucThanhToan)
  phuongThuc: PhuongThucThanhToan;
}
