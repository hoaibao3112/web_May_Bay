import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleStrategy {
  private client: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.client = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async verifyToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  getAuthUrl(redirectUri: string) {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      redirect_uri: redirectUri,
    });
  }

  async getTokens(code: string, redirectUri: string) {
    const { tokens } = await this.client.getToken({
      code,
      redirect_uri: redirectUri,
    });
    return tokens;
  }

  async getUserInfo(accessToken: string) {
    this.client.setCredentials({ access_token: accessToken });
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return await userInfoResponse.json();
  }
}
