export interface SendPasswordResetEmailParams {
  to: string;
  resetUrl: string;
}

export interface EmailService {
  sendPasswordResetEmail(
    params: SendPasswordResetEmailParams
  ): Promise<{ success: boolean; devResetUrl?: string }>;
}

/**
 * Minimal email service abstraction.
 * Allows pluggable SMTP or third-party email provider in production
 * while safely providing a development-only mechanism for local testing.
 */
class DefaultEmailService implements EmailService {
  async sendPasswordResetEmail({ to, resetUrl }: SendPasswordResetEmailParams) {
    const isProduction = process.env.NODE_ENV === "production";

    if (!isProduction) {
      // In non-production environments, log a safe notification without raw tokens or sensitive data.
      console.log(`[EmailService] Password reset email triggered for recipient: ${to}`);
      return { success: true, devResetUrl: resetUrl };
    }

    // When configured with production SMTP/provider credentials, dispatch the actual email here.
    // e.g., using nodemailer / Resend / AWS SES.
    return { success: true };
  }
}

export const emailService: EmailService = new DefaultEmailService();
