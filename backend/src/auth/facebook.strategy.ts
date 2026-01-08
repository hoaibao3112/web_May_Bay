import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get('FACEBOOK_CLIENT_ID'),
            clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
            callbackURL: configService.get('FACEBOOK_CALLBACK_URL'),
            scope: ['public_profile'],
            profileFields: ['id', 'name', 'picture.type(large)'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: Function,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;

        const user = {
            facebookId: id,
            email: emails?.[0]?.value,
            hoTen: `${name?.givenName || ''} ${name?.familyName || ''}`.trim(),
            avatar: photos?.[0]?.value,
        };

        const validatedUser = await this.authService.validateFacebookUser(user);
        done(null, validatedUser);
    }
}
