export interface IEmailService {
  sendActivationEmail(email: string, activationToken: string, userName: string): Promise<{ success: boolean; messageId?: string }>;
  sendWelcomeEmail?(email: string, userName: string): Promise<{ success: boolean }>;
}
