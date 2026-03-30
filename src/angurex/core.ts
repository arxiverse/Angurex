import { createElement, type ComponentType } from 'react';

export interface Type<T> extends Function {
  new (...args: never[]): T;
}

export interface ComponentMetadata {
  selector: string;
  templateUrl: string;
  styleUrl?: string;
  imports?: unknown[];
}

export interface InjectableMetadata {
  providedIn?: 'root' | null;
}

export interface OnInit {
  ngOnInit(): void;
}

type Constructor<T = object> = new (...args: never[]) => T;

type InjectableClass<T = object> = Constructor<T> & {
  __injectable__?: InjectableMetadata;
};

type ComponentClass<T = object> = Constructor<T> & {
  __component__?: ComponentMetadata;
  __factory__?: () => Promise<ComponentType<{ instance: T }>>;
};

interface PendingTaskTracker {
  add(task: Promise<unknown>): Promise<unknown>;
  whenStable(): Promise<void>;
}

class TaskQueue implements PendingTaskTracker {
  private readonly pending = new Set<Promise<unknown>>();

  add<T>(task: Promise<T>): Promise<T> {
    this.pending.add(task);
    task.finally(() => {
      this.pending.delete(task);
    });
    return task;
  }

  async whenStable(): Promise<void> {
    while (this.pending.size > 0) {
      await Promise.allSettled(Array.from(this.pending));
    }
  }
}

class Injector {
  private readonly instances = new Map<Function, unknown>();
  private readonly providers: Map<Function, unknown>;
  private readonly tasks: PendingTaskTracker;

  constructor(
    providers = new Map<Function, unknown>(),
    tasks: PendingTaskTracker,
  ) {
    this.providers = providers;
    this.tasks = tasks;
  }

  get<T>(token: Type<T>): T {
    if (this.instances.has(token)) {
      return this.instances.get(token) as T;
    }

    if (this.providers.has(token)) {
      const value = this.providers.get(token) as T;
      this.instances.set(token, value);
      return value;
    }

    if ((token as InjectableClass<T>).__injectable__?.providedIn === 'root') {
      const instance = new token();
      this.instances.set(token, instance);
      return instance;
    }

    const instance = new token();
    this.instances.set(token, instance);
    return instance;
  }

  track<T>(task: Promise<T>): Promise<T> {
    return this.tasks.add(task) as Promise<T>;
  }

  whenStable(): Promise<void> {
    return this.tasks.whenStable();
  }
}

let activeInjector: Injector | null = null;

function withInjector<T>(injector: Injector, action: () => T): T {
  const previousInjector = activeInjector;
  activeInjector = injector;
  try {
    return action();
  } finally {
    activeInjector = previousInjector;
  }
}

function normalizeTemplatePath(currentModuleUrl: string, templateUrl: string): string {
  return new URL(templateUrl, currentModuleUrl).href;
}

function createTemplateFactory<T>(
  component: ComponentClass<T>,
  templateUrl: string,
  moduleUrl: string,
): () => Promise<ComponentType<{ instance: T }>> {
  const resolvedUrl = normalizeTemplatePath(moduleUrl, templateUrl);

  return async () => {
    const templateModule = await import(/* @vite-ignore */ resolvedUrl);
    const template = templateModule.default as ComponentType<{ instance?: T }>;

    if (typeof template !== 'function') {
      throw new Error(
        `Template for ${component.name} must export a default React component.`,
      );
    }

    return ({ instance }) => createElement(template, { instance });
  };
}

export function Component(
  metadata: ComponentMetadata,
  moduleUrl: string = import.meta.url,
) {
  return function decorate<T extends Constructor>(target: T): void {
    const component = target as unknown as ComponentClass<InstanceType<T>>;
    component.__component__ = metadata;
    component.__factory__ = createTemplateFactory(
      component,
      metadata.templateUrl,
      moduleUrl,
    );
  };
}

export function Injectable(metadata: InjectableMetadata = { providedIn: 'root' }) {
  return function decorate<T extends Constructor>(target: T): void {
    (target as unknown as InjectableClass<InstanceType<T>>).__injectable__ = metadata;
  };
}

export function inject<T>(token: Type<T>): T {
  if (!activeInjector) {
    throw new Error(`inject(${token.name}) called outside an injection context.`);
  }

  return activeInjector.get(token);
}

export function trackAsync<T>(task: Promise<T>): Promise<T> {
  if (!activeInjector) {
    throw new Error('trackAsync() called outside an injection context.');
  }

  return activeInjector.track(task);
}

export interface CompilationResult<T> {
  component: Type<T>;
  metadata: ComponentMetadata;
  template: ComponentType<{ instance: T }>;
}

export async function compileComponent<T>(
  component: Type<T>,
): Promise<CompilationResult<T>> {
  const componentClass = component as ComponentClass<T>;
  const metadata = componentClass.__component__;

  if (!metadata) {
    throw new Error(`${component.name} is missing @Component metadata.`);
  }

  if (!componentClass.__factory__) {
    throw new Error(`${component.name} does not have a compiled template factory.`);
  }

  const template = await componentClass.__factory__();
  return {
    component,
    metadata,
    template,
  };
}

export function createInjector(
  providers?: Map<Function, unknown>,
  tasks?: PendingTaskTracker,
): Injector {
  return new Injector(providers, tasks ?? new TaskQueue());
}

export function instantiateWithInjector<T>(injector: Injector, type: Type<T>): T {
  return withInjector(injector, () => injector.get(type));
}

export function runInInjectionContext<T>(injector: Injector, action: () => T): T {
  return withInjector(injector, action);
}
