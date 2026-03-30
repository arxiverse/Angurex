import { Injectable } from '../../angurex/core';

export class RegisterService {
  async loadHeadline(): Promise<string> {
    await Promise.resolve();
    return 'Register Works';
  }
}

Injectable()(RegisterService);
