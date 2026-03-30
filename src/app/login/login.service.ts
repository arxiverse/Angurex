import { Injectable } from '../../angurex/core';

export class LoginService {
  async loadHeadline(): Promise<string> {
    await Promise.resolve();
    return 'Login Works';
  }
}

Injectable()(LoginService);
