import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ForgotDto } from './dto/forgot.dto';
import { Utilities } from '../utils/utilities';
import { RollbarLogger } from 'nestjs-rollbar';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ResetUserDto } from 'src/auth/dto/reset-user.dto';
import { ForgotUserDto } from 'src/users/dto/forgot-user.dto';
import { PasswordEncrypterService } from 'src/utils/encryption/password-encrypter.service';

@Injectable()
export class AuthService {
  // private utilities = new Utilities();

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly utilities: Utilities,
    private readonly rollbarLogger: RollbarLogger,
    private readonly encrypterService: PasswordEncrypterService,
  ) {}

  async validateUser(email: string, _password: string): Promise<any> {
    try {
      const user = await this.usersService.findOne({ username: email });

      if (user) {
        const isValid = await this.encrypterService.verify(
          _password,
          user.password,
        );

        if (isValid) {
          return user;
        } else {
          return null;
        }
      }

      return null;
    } catch (error) {
      this.rollbarLogger.error(error, 'Auth - Error in validateUser');
      return null;
    }
  }

  async login(user: any) {
    try {
      const payload = {
        username: user.username,
        sub: user.userId,
        _id: user._id,
        roles: user.roles,
        isActive: user.isActive,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.rollbarLogger.error(error, 'Auth - Error in login');
      return null;
    }
  }

  async forgot(forgotDto: ForgotDto) {
    try {
      const user = await this.usersService.findOne({
        username: forgotDto.username,
      });

      if (user) {
        const token = await this.utilities.createToken();

        const forgotUser: ForgotUserDto = new ForgotUserDto();

        forgotUser.resetPasswordExpires =
          Date.now() + this.config.get<number>('PASSWORD_RESET_EXPIRES');
        forgotUser.resetPasswordToken = token;
        forgotUser._id = user._id;

        await this.usersService.updateForgotUser(forgotUser);

        await this.mailService.sendUserForgotPassword(
          user,
          forgotDto.hostInfo,
          token,
        );
      }

      return user;
    } catch (error) {
      this.rollbarLogger.error(error, 'Auth - Error in forgot');
      return null;
    }
  }

  async reset(resetUserDto: ResetUserDto): Promise<User> {
    try {
      const filter = {
        resetPasswordToken: resetUserDto.token,
        resetPasswordExpires: { $gt: Date.now() },
      };

      const user = await this.usersService.findOne(filter);

      if (user) {
        user.password = resetUserDto.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        return await this.usersService.updateUser(user);
      }

      return undefined;
    } catch (error) {
      this.rollbarLogger.error(error, 'Auth - Error in reset');
      return null;
    }
  }
}
