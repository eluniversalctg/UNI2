import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { MailService } from 'src/mail/mail.service';
import { UsersModule } from 'src/users/users.module';
import { PasswordEncrypterService } from 'src/utils/encryption/password-encrypter.service';
import { Utilities } from 'src/utils/utilities';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('TOKEN_SECRET'),
          signOptions: { expiresIn: config.get('TOKEN_EXPIRES') },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    Utilities,
    AuthService,
    JwtStrategy,
    MailService,
    LocalStrategy,
    PasswordEncrypterService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
