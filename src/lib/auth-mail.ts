import nodemailer from 'nodemailer';
import { env } from '@/lib/env.server';

export async function sendAuthEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const port = env.smtp.port;
  const secure = env.smtp.secure || port === 465;

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port,
    secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });

  await transporter.sendMail({
    from: env.smtp.from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}
