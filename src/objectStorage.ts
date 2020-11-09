export interface ObjectStorage<T> {
  get: (key: string) => T | undefined;
  getOrSet: (key: string, initialValue: (() => T) | T) => T;
  set: (key: string, newState: T) => void;
}
