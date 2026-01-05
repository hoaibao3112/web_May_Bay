import { IsInt, IsOptional, IsString, IsArray, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

class HanhKhachDto {
  @IsString()
  loai: string;

  @IsString()
  ho: string;

  @IsString()
  ten: string;

  @IsString()
  ngaySinh: string;

  @IsString()
  gioiTinh: string;

  @IsString()
  quocTich: string;
}

class ThongTinLienHeDto {
  @IsEmail()
  email: string;

  @IsString()
  soDienThoai: string;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HanhKhachDto)
  @IsOptional()
  hanhKhach?: HanhKhachDto[];

  @ValidateNested()
  @Type(() => ThongTinLienHeDto)
  @IsOptional()
  thongTinLienHe?: ThongTinLienHeDto;
}
