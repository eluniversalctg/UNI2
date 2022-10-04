import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Utilities {
  constructor(private readonly config: ConfigService) {}

  async createToken() {
    const hashed = await bcrypt.genSalt(10);
    if (hashed.includes('/')) {
      return this.createToken();
    }
    return hashed;
  }

  public getCredenctialsUnomi() {
    return Buffer.from(
      `${this.config.get<string>('USER_KARAF')}:${this.config.get<string>(
        'PASSWORD_KARAF',
      )}`,
    ).toString('base64');
  }
}
