// ✅ REFACTORED: Better validation, enum, constraints
import {
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsEmail,
  IsPositive,
  IsEnum,
  IsDateString,
  ArrayMinSize,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BOOKING_CONSTANTS } from '../../common/constants/booking-constants';

/**
 * Enum cho loại hành khách
 */
export enum PassengerTypeEnum {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
  INFANT = 'INFANT',
}

/**
 * Enum cho giới tính
 */
export enum GenderEnum {
  MALE = 'NAM',
  FEMALE = 'NU',
}

/**
 * DTO để thêm hành khách
 */
export class HanhKhachDto {
  @IsEnum(PassengerTypeEnum, {
    message: 'Loại hành khách phải là ADULT, CHILD, hoặc INFANT',
  })
  loai: PassengerTypeEnum;

  @IsString()
  @MinLength(1, { message: 'Họ không được để trống' })
  @MaxLength(50)
  ho: string;

  @IsString()
  @MinLength(1, { message: 'Tên không được để trống' })
  @MaxLength(50)
  ten: string;

  @IsDateString()
  ngaySinh: string;

  @IsEnum(GenderEnum, {
    message: 'Giới tính phải là NAM hoặc NU',
  })
  gioiTinh: GenderEnum;

  @IsString()
  @MinLength(2)
  @MaxLength(3)
  quocTich: string;
}

/**
 * DTO cho thông tin liên hệ
 */
export class ThongTinLienHeDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'Số điện thoại phải là 10 chữ số',
  })
  soDienThoai: string;
}

/**
 * DTO tạo booking - REFACTORED
 */
export class CreateBookingDto {
  @IsString()
  @IsOptional()
  searchSessionId?: string;

  @IsInt()
  @IsPositive({ message: 'changBayId phải > 0' })
  changBayId: number;

  @IsInt()
  @IsPositive({ message: 'hangVeId phải > 0' })
  hangVeId: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  nhomGiaId?: number;

  @IsArray({ message: 'Hành khách phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => HanhKhachDto)
  @IsOptional()
  @ArrayMinSize(0)
  hanhKhach?: HanhKhachDto[];

  @ValidateNested()
  @Type(() => ThongTinLienHeDto)
  @IsOptional()
  thongTinLienHe?: ThongTinLienHeDto;
}
