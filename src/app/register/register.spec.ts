import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ComponentFixture, TestBed } from '../../angurex/testing';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(Register);
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
    expect(component.headline).toBe('Register Works');
    expect(fixture.nativeElement.textContent).toContain('Register Works');
  });
});
