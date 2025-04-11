import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailSenderPort } from '../../application/ports/out/MailSenderPort';

@Injectable()
export class NodemailerMailSender implements MailSenderPort {
    private transporter = nodemailer.createTransport({
        host: 'smtp.host.com',
        port: 587,
        secure: false,
        auth: {
            user: 'user_needed',
            pass: 'pass_needed',
        },
    });

    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        await this.transporter.sendMail({
            from: 'Leadtech <no-reply@leadtech.com>',
            to,
            subject: 'Welcome to Leadtech',
            html: `Hello ${name}, thanks for registering on our site.<br>Regards, Leadtech Team`,
        });
    }
}