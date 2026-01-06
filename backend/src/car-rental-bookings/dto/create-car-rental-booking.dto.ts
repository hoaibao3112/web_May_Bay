import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarRentalBookingDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    nhaCungCapId: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    xeThueId?: number; // Specific vehicle (optional)

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    loaiXeId: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    giaThueXeId?: number; // Reference to pricing option

    @IsNotEmpty()
    @IsString()
    diemDon: string;

    @IsOptional()
    @IsString()
    diaChiDon?: string;

    @IsNotEmpty()
    @IsString()
    diemTra: string;

    @IsOptional()
    @IsString()
    diaChiTra?: string;

    @IsNotEmpty()
    @IsDateString()
    thoiGianDon: string; // ISO format

    @IsOptional()
    @IsDateString()
    thoiGianTraDuKien?: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    soHanhKhach: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    soHanhLy: number;

    @IsNotEmpty()
    @IsString()
    tenHanhKhach: string;

    @IsNotEmpty()
    @IsString()
    soDienThoai: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    ghiChu?: string;

    @IsOptional()
    @IsString()
    soHieuChuyenBay?: string; // Flight number for airport pickup

    @IsOptional()
    @IsDateString()
    gioHaCanh?: string; // Landing time

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    giaThue: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    phuThu?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    giamGia?: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    tongTien: number;

    @IsOptional()
    @IsString()
    phuongThucThanhToan?: string;
}
