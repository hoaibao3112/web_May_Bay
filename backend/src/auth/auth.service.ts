import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleStrategy } from './google.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private googleStrategy: GoogleStrategy,
  ) {}

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
}

