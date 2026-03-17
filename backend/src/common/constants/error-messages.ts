/**
 * Centralized error messages - giảm lỗi spelling, consistency
 */
export const ERROR_MESSAGES = {
  // Auth errors
  EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng',
  INVALID_CREDENTIALS: 'Tài khoản hoặc mật khẩu không hợp lệ',
  EMAIL_NOT_FOUND: 'Email không tồn tại',
  INVALID_OTP: 'Mã OTP không hợp lệ hoặc đã hết hạn',
  INVALID_CURRENT_PASSWORD: 'Mật khẩu hiện tại không đúng',
  SAME_PASSWORD: 'Mật khẩu mới phải khác mật khẩu hiện tại',
  GOOGLE_AUTH_FAILED: 'Xác thực Google thất bại',
  GOOGLE_ACCOUNT_NO_PASSWORD: 'Tài khoản Google không thể đổi mật khẩu bằng phương thức này',
  USER_NOT_FOUND: 'Người dùng không tồn tại',
  UNAUTHORIZED: 'Chưa được xác thực',

  // Booking errors
  BOOKING_NOT_FOUND: 'Không tìm thấy đơn đặt vé',
  NO_AVAILABLE_SEATS: 'Không còn chỗ trống cho chuyến bay này',
  INVALID_BOOKING_STATUS: 'Không thể thêm hành khách cho đơn đặt vé này',
  NO_PASSENGERS: 'Vui lòng thêm thông tin hành khách trước khi thanh toán',
  INVALID_PAYMENT_STATUS: 'Đơn đặt vé không ở trạng thái cho phép thanh toán',

  // Payment errors
  PAYMENT_FAILED: 'Thanh toán không thành công',
  INVALID_PAYMENT_METHOD: 'Phương thức thanh toán không hợp lệ',
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  OTP_SENT: 'Mã OTP đã được gửi đến email của bạn',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công',
  BOOKING_CREATED: 'Tạo đơn đặt vé thành công',
};
