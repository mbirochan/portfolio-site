import nodemailer from 'nodemailer';
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  subject: z.string().min(5, 'Subject must be at least 5 characters').trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

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
    
    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email || process.env.GMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      text: `
Name: ${name}
Email: ${email || 'Not provided'}
Subject: ${subject}
Message: ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="margin-top: 10px; padding: 10px; background-color: #fff; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `,
    };
    
    try {
      const info = await transporter.sendMail(mailOptions);
      
      if (email) {
        const confirmationOptions = {
          from: `"Birochan Mainali" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Thank you for your message',
          text: `
Hello ${name},
Thank you for contacting me. I have received your message and will get back to you soon.
Best regards,
Birochan Mainali
          `,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Thank you for your message</h2>
              <p>Hello ${name},</p>
              <p>Thank you for contacting me. I have received your message and will get back to you soon.</p>
              <p style="margin-top: 20px;">Best regards,<br>Birochan Mainali</p>
            </div>
          `,
        };
        await transporter.sendMail(confirmationOptions);
      }
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

export const emailService = new EmailService(); 