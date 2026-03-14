import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mail.host'),
      port: this.configService.get('mail.port'),
      secure: false,
      auth: {
        user: this.configService.get('mail.user'),
        pass: this.configService.get('mail.password'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const appUrl = this.configService.get('app.appUrl');
    const url = `${appUrl}/api/v1/auth/verify-email?token=${token}`;

    await this.sendMail({
      to,
      subject: 'Подтверждение email — Titeca',
      html: `
        <h2>Добро пожаловать на Titeca!</h2>
        <p>Для подтверждения вашего email перейдите по ссылке:</p>
        <a href="${url}">Подтвердить email</a>
        <p>Ссылка действует 24 часа.</p>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get('app.frontendUrl');
    const url = `${frontendUrl}/reset-password?token=${token}`;

    await this.sendMail({
      to,
      subject: 'Сброс пароля — Titeca',
      html: `
        <h2>Сброс пароля</h2>
        <p>Для сброса пароля перейдите по ссылке:</p>
        <a href="${url}">Сбросить пароль</a>
        <p>Ссылка действует 1 час.</p>
      `,
    });
  }

  private async sendMail(options: { to: string; subject: string; html: string }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('mail.from'),
        ...options,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
    }
  }
}
