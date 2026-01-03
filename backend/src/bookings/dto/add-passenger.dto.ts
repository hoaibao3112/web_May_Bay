import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { LoaiHanhKhach } from '../../common/enums/booking.enum';

export class AddPassengerDto {
  @IsEnum(LoaiHanhKhach)
  loai: LoaiHanhKhach;

  @IsString()
  ho: string;

  @IsString()
  ten: string;

  @IsString()
  gioiTinh: string; // NAM, NU

  @IsDateString()
  ngaySinh: string;

  @IsString()
  @IsOptional()
  soCccd?: string;

  @IsString()
  @IsOptional()
  soHoChieu?: string;

  @IsDateString()
  @IsOptional()
  ngayHetHan?: string;

  @IsString()
  @IsOptional()
  quocTich?: string;
}
