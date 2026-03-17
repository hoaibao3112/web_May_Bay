/**
 * Booking constants - tập hợp các giá trị được dùng lại
 */
import { TrangThaiDonDatVe } from '../enums/booking-status.enum';

export const BOOKING_CONSTANTS = {
  // Thời gian giữ chỗ (phút)
  HOLD_TIME_MINUTES: 15,

  // Trạng thái booking - ✅ FIXED: Dùng Enum thay vì string literal
  STATUS: {
    HOLDING: TrangThaiDonDatVe.GIU_CHO,
    WAIT_PAYMENT: TrangThaiDonDatVe.CHO_THANH_TOAN,
    PAID: TrangThaiDonDatVe.DA_THANH_TOAN,
    CANCELLED: TrangThaiDonDatVe.HUY,
    COMPLETED: TrangThaiDonDatVe.DA_XUAT_VE,
  },

  // Loại hành khách
  PASSENGER_TYPE: {
    ADULT: 'ADULT',
    CHILD: 'CHILD',
    INFANT: 'INFANT',
  },

  // Giới tính
  GENDER: {
    MALE: 'NAM',
    FEMALE: 'NU',
  },

  // Mặc định tiền tệ
  DEFAULT_CURRENCY: 'VND',
};

export const PAYMENT_CONSTANTS = {
  // Phương thức thanh toán
  METHOD: {
    VNPAY: 'VNPAY',
    MOMO: 'MOMO',
    VIETQR: 'VIETQR',
    ZALOPAY: 'ZALOPAY',
  },

  // Trạng thái thanh toán
  STATUS: {
    INITIATED: 'KHOI_TAO',
    PENDING: 'CHO_THANH_TOAN',
    PAID: 'DA_THANH_TOAN',
    FAILED: 'THAT_BAI',
    CANCELLED: 'HUY',
  },
};
