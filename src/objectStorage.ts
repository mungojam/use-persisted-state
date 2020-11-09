export interface ObjectStorage<T> {
  get: (key: string, initialValue: (() => T) | T) => T;
  set: (key: string, newState: T) => void;
}
