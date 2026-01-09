import { IsOptional, IsString, IsInt, Min, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchActivitiesDto {
    @IsOptional()
    @IsString()
    thanhPho?: string;

    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    danhMucId?: number;

    @IsOptional()
    @IsDateString()
    ngay?: string;

    @IsOptional()
    @IsString()
    timKiem?: string; // Search keyword

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    limit?: number = 12;

    @IsOptional()
    @IsString()
    sapXep?: 'gia-tang' | 'gia-giam' | 'pho-bien' | 'danh-gia';
}
