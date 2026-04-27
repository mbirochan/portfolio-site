import nodemailer from 'nodemailer';
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').max(254).optional().or(z.literal('')),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200).trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000).trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

const stripHeaderInjection = (s: string) => s.replace(/[\r\n]+/g, ' ').slice(0, 200);

class EmailService {
  async sendContactEmail(data: ContactFormData) {
    const { name, email, subject, message } = data;

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Email service not configured');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = email ? escapeHtml(email) : 'Not provided';
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email || process.env.GMAIL_USER,
      subject: stripHeaderInjection(`New Contact Form Submission: ${subject}`),
      text: `Name: ${name}\nEmail: ${email || 'Not provided'}\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Message:</strong></p>
            <div style="margin-top: 10px; padding: 10px; background-color: #fff; border-radius: 4px;">
              ${safeMessage}
            </div>
          </div>
        </div>
      `,
    });

    return { success: true };
  }
}

export const emailService = new EmailService();
