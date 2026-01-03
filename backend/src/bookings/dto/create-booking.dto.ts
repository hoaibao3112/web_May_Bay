import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsOptional()
  searchSessionId?: string;

  @IsInt()
  changBayId: number;

  @IsInt()
  hangVeId: number;

  @IsInt()
  @IsOptional()
  nhomGiaId?: number;
}
