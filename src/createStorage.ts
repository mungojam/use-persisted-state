import { isValue, ValueOrGenerator } from 'valueOrFunction';
import { ObjectStorage } from './objectStorage';
import { Provider } from './provider';

const createStorage = <T>(provider: Provider): ObjectStorage<T> => {
  const setValue = (key: string, value: T) => {
    provider.setItem(key, JSON.stringify(value));
  };
  const getValue = (key:string) => {
    const json = provider.getItem(key);

    if(json === null || json === "null") {
      return undefined;
    }
    
    return JSON.parse(json) as T;
  }

  return ({
    get(key: string) {
      return getValue(key);
    },
    getOrSet(key: string, defaultValue: ValueOrGenerator<T>) {
      const value = getValue(key);

      if (value === undefined) {
        const actualDefaultValue = isValue(defaultValue) ? defaultValue : defaultValue();

        setValue(key, actualDefaultValue)

        return actualDefaultValue;
      }

      return value;
    },
    set(key: string, value: T) {
      setValue(key, value);
    },
  });
};

export default createStorage;
