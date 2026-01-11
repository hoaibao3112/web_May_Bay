import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ValidatePromotionDto {
    @IsString()
    @IsNotEmpty()
    maKhuyenMai: string;

    @IsNumber()
    @Min(0)
    tongTien: number; // Total booking amount
}
