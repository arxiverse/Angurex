import { Component, inject, trackAsync } from '../../angurex/core';
import { RegisterService } from './register.service';

export class Register {
  readonly registerService = inject(RegisterService);
  headline = 'Loading...';

  ngOnInit(): void {
    void trackAsync(this.registerService.loadHeadline()).then((headline) => {
      this.headline = headline;
    });
  }
}

Component(
  {
    selector: 'app-register',
    imports: [],
    templateUrl: './register.tsx',
    styleUrl: './register.css',
  },
  import.meta.url,
)(Register);
