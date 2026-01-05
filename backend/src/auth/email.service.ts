import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private otpStore: Map<string, { otp: string; expiresAt: Date }> = new Map();

    constructor() {
        // Configure nodemailer with Gmail
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }

    /**
     * Generate a 6-digit OTP
     */
    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Send OTP email for password change
     */
    async sendPasswordOTP(email: string): Promise<void> {
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Store OTP
        this.otpStore.set(email, { otp, expiresAt });

        // Email template
        const mailOptions = {
            from: `"BayNhanh Support" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: '🔐 Mã OTP Đổi Mật Khẩu - BayNhanh',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                        ✈️ BayNhanh
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">
                        Xác Nhận Đổi Mật Khẩu
                      </h2>
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Chúng tôi nhận được yêu cầu đổi mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP dưới đây để xác nhận:
                      </p>
                      
                      <!-- OTP Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center" style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; border: 2px dashed #667eea;">
                            <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                              ${otp}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                        ⏱️ Mã OTP này có hiệu lực trong <strong style="color: #e74c3c;">5 phút</strong>.
                      </p>
                      
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #856404; font-size: 14px;">
                          ⚠️ <strong>Lưu ý:</strong> Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này và đảm bảo tài khoản của bạn được bảo mật.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                        © 2026 BayNhanh. All rights reserved.
                      </p>
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        Email này được gửi tự động, vui lòng không trả lời.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send OTP email');
        }
    }

    /**
     * Verify OTP
     */
    verifyOTP(email: string, otp: string): boolean {
        const stored = this.otpStore.get(email);

        if (!stored) {
            return false;
        }

        // Check if OTP expired
        if (new Date() > stored.expiresAt) {
            this.otpStore.delete(email);
            return false;
        }

        // Check if OTP matches
        if (stored.otp !== otp) {
            return false;
        }

        // OTP is valid, remove it
        this.otpStore.delete(email);
        return true;
    }

    /**
     * Clear expired OTPs periodically
     */
    clearExpiredOTPs(): void {
        const now = new Date();
        for (const [email, { expiresAt }] of this.otpStore.entries()) {
            if (now > expiresAt) {
                this.otpStore.delete(email);
            }
        }
    }
}
