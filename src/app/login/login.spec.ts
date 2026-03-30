import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ComponentFixture, TestBed } from '../../angurex/testing';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(Login);
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
    expect(component.headline).toBe('Login Works');
    expect(fixture.nativeElement.textContent).toContain('Login Works');
  });
});
