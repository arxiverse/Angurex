import { Component, inject, trackAsync } from '../../angurex/core';
import { HomeService } from './home.service';

export class Home {
  readonly homeService = inject(HomeService);
  headline = 'Loading...';

  ngOnInit(): void {
    void trackAsync(this.homeService.loadHeadline()).then((headline) => {
      this.headline = headline;
    });
  }
}

Component(
  {
    selector: 'app-home',
    imports: [],
    templateUrl: './home.tsx',
    styleUrl: './home.css',
  },
  import.meta.url,
)(Home);
