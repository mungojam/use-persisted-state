import { ObjectStorage } from './objectStorage';
import { Provider } from './provider';

const createStorage = <T>(provider: Provider): ObjectStorage<T> => ({
  get(key: string, defaultValue: () => T | T) {
    const json = provider.getItem(key);

    if (json === null) {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }

    const parsed = JSON.parse(json) as T;

    return parsed;
  },
  set(key: string, value: T) {
    provider.setItem(key, JSON.stringify(value));
  },
});

export default createStorage;
