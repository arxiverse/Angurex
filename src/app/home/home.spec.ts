import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ComponentFixture, TestBed } from '../../angurex/testing';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve the async headline through the Angular-style runtime', () => {
    expect(component.headline).toBe('Home Works');
    expect(fixture.nativeElement.textContent).toContain('Home Works');
  });
});
