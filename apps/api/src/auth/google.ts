import { OAuth2Client } from 'google-auth-library';
import type { Config } from '../config.js';

export interface GoogleProfile {
  email: string;
  name: string | null;
  googleId: string;
}

/** Seam de autenticação Google, injetável nos testes. */
export interface GoogleClient {
  buildAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<GoogleProfile>;
}

export class RealGoogleClient implements GoogleClient {
  private client: OAuth2Client;
  private clientId: string;

  constructor(config: Config) {
    this.clientId = config.google.clientId;
    this.client = new OAuth2Client(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri,
    );
  }

  buildAuthUrl(state: string): string {
    return this.client.generateAuthUrl({
      access_type: 'online',
      scope: ['openid', 'email', 'profile'],
      state,
    });
  }

  async exchangeCode(code: string): Promise<GoogleProfile> {
    const { tokens } = await this.client.getToken(code);
    const idToken = tokens.id_token;
    if (!idToken) throw new Error('Google não devolveu id_token');

    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.email || payload.email_verified !== true) {
      throw new Error('e-mail do Google não verificado');
    }
    return {
      email: payload.email,
      name: payload.name ?? null,
      googleId: payload.sub,
    };
  }
}
