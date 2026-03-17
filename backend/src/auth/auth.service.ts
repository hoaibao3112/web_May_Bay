import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleStrategy } from './google.strategy';
import { EmailService } from './email.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants/error-messages';
import { BOOKING_CONSTANTS } from '../common/constants/booking-constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private googleStrategy: GoogleStrategy,
    private emailService: EmailService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        hoTen: dto.hoTen,
        soDienThoai: dto.soDienThoai,
        vaiTro: 'CUSTOMER',
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const payload = { sub: user.id, email: user.email, vaiTro: user.vaiTro };
    const accessToken = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;

    return {
      accessToken,
      user: userWithoutPassword,
    };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { password, ...result } = user;
    return result;
  }

  async googleLogin(idToken: string) {
    try {
      const googleUser = await this.googleStrategy.verifyToken(idToken);

      if (!googleUser || !googleUser.email) {
        throw new UnauthorizedException(ERROR_MESSAGES.GOOGLE_AUTH_FAILED);
      }

      let user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: googleUser.email,
            hoTen: googleUser.name || googleUser.email,
            password: '',
            vaiTro: 'CUSTOMER',
            googleId: googleUser.sub,
          },
        });
      } else if (!user.googleId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleUser.sub },
        });
      }

      const payload = { sub: user.id, email: user.email, vaiTro: user.vaiTro };
      const accessToken = this.jwtService.sign(payload);

      const { password, ...userWithoutPassword } = user;

      return {
        accessToken,
        user: userWithoutPassword,
      };
    } catch (error) {
      this.logger.error('Google authentication error', error);
      throw new UnauthorizedException(ERROR_MESSAGES.GOOGLE_AUTH_FAILED);
    }
  }

  /**
   * Gửi OTP cho đổi mật khẩu
   */
  async sendPasswordOTP(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.EMAIL_NOT_FOUND);
    }

    if (!user.password || user.password === '') {
      throw new BadRequestException(ERROR_MESSAGES.GOOGLE_ACCOUNT_NO_PASSWORD);
    }

    await this.emailService.sendPasswordOTP(email);

    return {
      message: SUCCESS_MESSAGES.OTP_SENT,
      expiresIn: '5 phút',
    };
  }

  /**
   * Đổi mật khẩu với xác thực OTP
   */
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CURRENT_PASSWORD);
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(ERROR_MESSAGES.SAME_PASSWORD);
    }

    // Verify OTP
    const isOtpValid = this.emailService.verifyOTP(user.email, dto.otp);
    if (!isOtpValid) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OTP);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: SUCCESS_MESSAGES.CHANGE_PASSWORD_SUCCESS,
    };
  }

  async validateFacebookUser(facebookUser: {
    facebookId: string;
    email?: string;
    hoTen?: string;
    avatar?: string;
  }) {
    try {
      // Try to find user by facebookId first
      let user = await this.prisma.user.findFirst({
        where: { facebookId: facebookUser.facebookId },
      });

      if (!user && facebookUser.email) {
        // Try to find by email
        user = await this.prisma.user.findUnique({
          where: { email: facebookUser.email },
        });

        if (user) {
          // Update existing user with Facebook ID
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: {
              facebookId: facebookUser.facebookId,
              avatar: facebookUser.avatar || user.avatar,
            },
          });
        }
      }

      if (!user) {
        // Create new user from Facebook
        user = await this.prisma.user.create({
          data: {
            email: facebookUser.email || `facebook_${facebookUser.facebookId}@temp.com`,
            hoTen: facebookUser.hoTen || 'Facebook User',
            password: '', // No password for OAuth
            vaiTro: 'CUSTOMER',
            facebookId: facebookUser.facebookId,
            avatar: facebookUser.avatar,
          },
        });
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException('Facebook authentication failed');
    }
  }
}

