import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class GenerateQrCodeDto {
    @IsNumber()
    @IsNotEmpty()
    bookingId: number;
}

export class VerifyQrCodeDto {
    @IsString()
    @IsNotEmpty()
    qrData: string;
}

export class CheckInDto {
    @IsNumber()
    @IsNotEmpty()
    hanhKhachId: number;

    @IsString()
    @IsOptional()
    nguoiCheckIn?: string;
}

export interface QrCodeDataInterface {
    bookingId: number;
    maDatVe: string;
    hanhKhach: Array<{
        id: number;
        ho: string;
        ten: string;
        loai: string;
    }>;
    changBay: {
        soHieuChuyenBay: string;
        sanBayDi: string;
        sanBayDen: string;
        gioDi: string;
        gioDen: string;
    };
    generatedAt: string;
}
