import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleStrategy } from './google.strategy';
import { EmailService } from './email.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private googleStrategy: GoogleStrategy,
    private emailService: EmailService,
  ) { }

  async register(dto: RegisterDto) {
    // Kiểm tra email đã tồn tại
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Tạo user mới
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
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
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
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;
    return result;
  }

  async googleLogin(idToken: string) {
    try {
      const googleUser = await this.googleStrategy.verifyToken(idToken);

      if (!googleUser || !googleUser.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      // Tìm hoặc tạo user
      let user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (!user) {
        // Tạo user mới từ Google
        user = await this.prisma.user.create({
          data: {
            email: googleUser.email,
            hoTen: googleUser.name || googleUser.email,
            password: '', // Không cần password cho Google OAuth
            vaiTro: 'CUSTOMER',
            googleId: googleUser.sub,
          },
        });
      } else if (!user.googleId) {
        // Cập nhật googleId nếu user đã tồn tại nhưng chưa có
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
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  /**
   * Send OTP for password change
   */
  async sendPasswordOTP(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    // Don't allow OTP for Google accounts without password
    if (!user.password || user.password === '') {
      throw new BadRequestException('Tài khoản Google không thể đổi mật khẩu bằng phương thức này');
    }

    await this.emailService.sendPasswordOTP(email);

    return {
      message: 'Mã OTP đã được gửi đến email của bạn',
      expiresIn: '5 phút',
    };
  }

  /**
   * Change password with OTP verification
   */
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu hiện tại');
    }

    // Verify OTP
    const isOtpValid = this.emailService.verifyOTP(user.email, dto.otp);
    if (!isOtpValid) {
      throw new BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: 'Đổi mật khẩu thành công',
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

