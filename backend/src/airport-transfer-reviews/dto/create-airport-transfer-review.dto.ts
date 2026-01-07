export class CreateAirportTransferReviewDto {
    datDichVuId: number;
    userId: number;
    nhaCungCapId: number;
    danhGia: number; // 1-5 stars
    binhLuan?: string;
}
