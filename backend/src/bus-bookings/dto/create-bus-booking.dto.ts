import { IsNotEmpty, IsNumber, IsArray, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBusBookingDto {
    @IsNotEmpty({ message: 'Mã chuyến xe không được để trống' })
    @IsNumber({}, { message: 'Mã chuyến xe phải là số' })
    @Type(() => Number)
    chuyenXeId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    soLuongGhe: number;

    @IsNotEmpty()
    @IsArray()
    danhSachGhe: string[]; // ["A1", "A2"]

    @IsNotEmpty()
    @IsArray()
    hanhKhach: PassengerDto[];

    @IsOptional()
    @IsString()
    ghiChu?: string;
}

export class PassengerDto {
    @IsNotEmpty()
    @IsString()
    hoTenHanhKhach: string;

    @IsOptional()
    @IsString()
    soDienThoai?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsNotEmpty()
    @IsString()
    soGhe: string;
}
