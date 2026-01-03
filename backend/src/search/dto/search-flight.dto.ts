import {
  IsInt,
  IsDateString,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { LoaiChuyen } from '../../common/enums/booking.enum';

export class SearchFlightDto {
  @IsInt()
  sanBayDiId: number;

  @IsInt()
  sanBayDenId: number;

  @IsDateString()
  ngayDi: string;

  @IsDateString()
  @IsOptional()
  ngayVe?: string;

  @IsEnum(LoaiChuyen)
  loaiChuyen: LoaiChuyen;

  @IsInt()
  @Min(1)
  nguoiLon: number;

  @IsInt()
  @Min(0)
  treEm: number;

  @IsInt()
  @Min(0)
  soSinh: number;

  @IsOptional()
  khoang?: string; // ECONOMY, BUSINESS
}
