import { createTransport, type Transporter } from 'nodemailer';
import type { Config } from '../config.js';

/**
 * Seam de envio de e-mail. Os testes injetam um mailer que registra o código;
 * em produção usamos SMTP (qualquer relay, incluindo Resend por SMTP).
 */
export interface Mailer {
  sendLoginCode(to: string, code: string): Promise<void>;
}

export class ConsoleMailer implements Mailer {
  async sendLoginCode(to: string, code: string): Promise<void> {
    // Em desenvolvimento o código vai para o log, não para o usuário.
    console.log(`[mail] código de acesso para ${to}: ${code}`);
  }
}

export class SmtpMailer implements Mailer {
  private transporter: Transporter;
  private from: string;

  constructor(config: Config) {
    this.from = config.smtp.from;
    this.transporter = createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth:
        config.smtp.user && config.smtp.pass
          ? { user: config.smtp.user, pass: config.smtp.pass }
          : undefined,
    });
  }

  async sendLoginCode(to: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Seu código de acesso — Playbook do Time',
      text: `Seu código de acesso é ${code}. Ele expira em alguns minutos.`,
    });
  }
}

export function createMailer(config: Config): Mailer {
  if (config.mailer === 'smtp') return new SmtpMailer(config);
  return new ConsoleMailer();
}
