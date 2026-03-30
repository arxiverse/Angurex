import { Injectable } from '../../angurex/core';

export class HomeService {
  async loadHeadline(): Promise<string> {
    await Promise.resolve();
    return 'Home Works';
  }
}

Injectable()(HomeService);
