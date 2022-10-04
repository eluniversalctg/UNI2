/* eslint-disable @typescript-eslint/ban-types */
import { Bcrypt } from './bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordEncrypterService {
  private bcrypt: Bcrypt;

  constructor() {
    this.bcrypt = new Bcrypt();
  }

  async hash(password: string, callback?: Function): Promise<string> {
    try {
      return await this.bcrypt.hash(password, callback);
    } catch (error) {
      return '';
    }
  }

  async verify(
    password: string,
    encrypted: string,
    callback?: Function,
  ): Promise<boolean> {
    try {
      return await this.bcrypt.compare(password, encrypted, callback);
    } catch (error) {
      return false;
    }
  }
}
