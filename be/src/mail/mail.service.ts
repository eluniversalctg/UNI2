import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to UNI2! Confirm your Email',
      template: '/confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.username,
        url,
      },
    });
  }

  async sendUserForgotPassword(user: User, host: string, token: string) {
    const url = `http://${host}/auth/resetPassword/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <notificaciones@rdscr.com>', // override default from
      subject: 'Recuperación de Contraseña',
      template: '/forgot', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        userName: user.username,
        url,
      },
    });
  }
}
