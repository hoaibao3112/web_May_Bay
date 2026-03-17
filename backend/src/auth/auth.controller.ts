import { Body, Controller, Post, UseGuards, Get, Request, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { RequestOtpDto } from './dto/request-otp.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('google')
  async googleLogin(@Body('idToken') idToken: string) {
    return this.authService.googleLogin(idToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-password-otp')
  async requestPasswordOTP(@Request() req) {
    return this.authService.sendPasswordOTP(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, dto);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    // Initiates Facebook OAuth flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(
    @Request() req,
    @Response({ passthrough: true }) res,
  ) {
    // ✅ Táo JWT token
    const payload = {
      sub: req.user.id,
      email: req.user.email,
      vaiTro: req.user.vaiTro,
    };
    const accessToken = this.jwtService.sign(payload);

    // ✅ Gửi token qua httpOnly cookie (bảo mật)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,      // JavaScript không đọc được
      secure: process.env.NODE_ENV === 'production', // HTTPS only trên production
      sameSite: 'strict',  // Chống CSRF
      maxAge: 24 * 60 * 60 * 1000, // 24 giờ
    });

    // ✅ Redirect về frontend với success flag
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/auth/callback?status=success`);
  }
}

