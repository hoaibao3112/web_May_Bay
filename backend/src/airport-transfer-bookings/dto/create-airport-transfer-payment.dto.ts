export class CreateAirportTransferPaymentDto {
    bookingId: number;
    phuongThucThanhToan: string; // 'credit_card', 'bank_transfer', 'momo', 'zalopay', etc.
    soTien: number;
}
