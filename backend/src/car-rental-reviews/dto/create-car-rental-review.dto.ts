import { IsNotEmpty, IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarRentalReviewDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    nhaCungCapId: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    donThueXeId?: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    diemXe: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    diemTaiXe: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    diemDungGio: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    diemSachSe: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    diemGiaCa: number;

    @IsOptional()
    @IsString()
    binhLuan?: string;

    @IsOptional()
    @IsString()
    hinhAnh?: string; // JSON string of image URLs
}
