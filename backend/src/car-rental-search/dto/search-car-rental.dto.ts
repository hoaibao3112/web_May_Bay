import { IsString, IsOptional, IsInt, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchCarRentalDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    diemDiId?: number; // Airport ID

    @IsOptional()
    @IsString()
    diemDi?: string; // Pickup location name

    @IsOptional()
    @IsString()
    diemDen?: string; // Dropoff location name

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    tuyenDuongId?: number; // Route ID

    @IsDateString()
    ngayGioDon: string; // Pickup date/time (ISO format)

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    soHanhKhach?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(0)
    soHanhLy?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    loaiXeId?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    nhaCungCapId?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(0)
    giaMin?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(0)
    giaMax?: number;
}
