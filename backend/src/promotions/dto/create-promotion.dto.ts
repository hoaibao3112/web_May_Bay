import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsDateString, Min } from 'class-validator';

export class CreatePromotionDto {
    @IsString()
    @IsNotEmpty()
    maKhuyenMai: string; // SUMMER2024

    @IsString()
    @IsNotEmpty()
    tenKhuyenMai: string;

    @IsString()
    @IsOptional()
    moTa?: string;

    @IsString()
    @IsNotEmpty()
    loaiGiam: 'PERCENT' | 'FIXED';

    @IsNumber()
    @Min(0)
    giaTriGiam: number; // 30 (for 30%) or 100000 (for 100k VND)

    @IsNumber()
    @IsOptional()
    @Min(0)
    giamToiDa?: number; // Max discount amount for PERCENT type

    @IsNumber()
    @Min(0)
    giaTriDonToiThieu: number; // Minimum order value

    @IsNumber()
    @Min(1)
    soLuotSuDung: number; // Total usage limit

    @IsDateString()
    ngayBatDau: string;

    @IsDateString()
    ngayKetThuc: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
