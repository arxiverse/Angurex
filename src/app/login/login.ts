import { Component, inject, trackAsync } from '../../angurex/core';
import { LoginService } from './login.service';

export class Login {
  readonly loginService = inject(LoginService);
  headline = 'Loading...';

  ngOnInit(): void {
    void trackAsync(this.loginService.loadHeadline()).then((headline) => {
      this.headline = headline;
    });
  }
}

Component(
  {
    selector: 'app-login',
    imports: [],
    templateUrl: './login.tsx',
    styleUrl: './login.css',
  },
  import.meta.url,
)(Login);
