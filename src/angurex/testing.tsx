import { act, render, type RenderResult } from '@testing-library/react';
import { createElement } from 'react';

import {
  compileComponent,
  createInjector,
  instantiateWithInjector,
  runInInjectionContext,
  type CompilationResult,
  type Type,
} from './core';

interface TestingModuleConfig {
  imports?: Array<Type<unknown>>;
  providers?: Array<{ provide: Function; useValue: unknown }>;
}

class TestingCompiler {
  private readonly config: TestingModuleConfig;

  constructor(config: TestingModuleConfig) {
    this.config = config;
  }

  async compileComponents(): Promise<void> {
    const imports = this.config.imports ?? [];
    await Promise.all(imports.map((component) => compileComponent(component)));
  }
}

export class ComponentFixture<T> {
  componentInstance: T;
  nativeElement: HTMLElement;

  private renderResult: RenderResult | null = null;
  private readonly compilation: CompilationResult<T>;
  private readonly injector: ReturnType<typeof createInjector>;

  constructor(
    compilation: CompilationResult<T>,
    injector: ReturnType<typeof createInjector>,
  ) {
    this.compilation = compilation;
    this.injector = injector;
    this.componentInstance = instantiateWithInjector(injector, compilation.component);

    if (typeof (this.componentInstance as { ngOnInit?: () => void }).ngOnInit === 'function') {
      runInInjectionContext(this.injector, () => {
        (this.componentInstance as { ngOnInit: () => void }).ngOnInit();
      });
    }

    this.renderResult = render(
      runInInjectionContext(this.injector, () =>
        createElement(this.compilation.template, { instance: this.componentInstance }),
      ),
    );
    this.nativeElement = this.renderResult.container;
  }

  detectChanges(): void {
    if (!this.renderResult) {
      throw new Error('ComponentFixture has already been destroyed.');
    }

    this.renderResult.rerender(
      runInInjectionContext(this.injector, () =>
        createElement(this.compilation.template, { instance: this.componentInstance }),
      ),
    );
  }

  async whenStable(): Promise<void> {
    await act(async () => {
      await this.injector.whenStable();
    });
  }

  destroy(): void {
    this.renderResult?.unmount();
    this.renderResult = null;
  }
}

class AngurexTestBed {
  private imports: Array<Type<unknown>> = [];
  private providers = new Map<Function, unknown>();
  private readonly compiled = new Map<Type<unknown>, CompilationResult<unknown>>();

  async configureTestingModule(config: TestingModuleConfig): Promise<TestingCompiler> {
    this.imports = config.imports ?? [];
    this.providers = new Map(
      (config.providers ?? []).map((provider) => [provider.provide, provider.useValue]),
    );

    return new TestingCompiler(config);
  }

  async compileComponents(): Promise<void> {
    const compilations = await Promise.all(
      this.imports.map(async (component) => [component, await compileComponent(component)] as const),
    );

    this.compiled.clear();
    compilations.forEach(([component, compilation]) => {
      this.compiled.set(component, compilation);
    });
  }

  createComponent<T>(component: Type<T>): ComponentFixture<T> {
    const compilation = this.compiled.get(component) as CompilationResult<T> | undefined;

    if (!compilation) {
      throw new Error(`${component.name} has not been compiled. Call compileComponents() first.`);
    }

    const injector = createInjector(this.providers);
    return new ComponentFixture(compilation, injector);
  }
}

export const TestBed = new AngurexTestBed();
