export interface MailSenderPort {
    sendWelcomeEmail(to: string, name: string): Promise<void>;
}