import { useState } from 'react';

import usePersistedState from './usePersistedState';
import createStorage from './createStorage';

import { Provider } from './provider';
import { ValueOrGenerator } from 'valueOrFunction';

const createPersistedState = <T>(
  key: string,
  provider: Provider = window.localStorage
): typeof useState => {
  if (provider) {
    const storage = createStorage<T>(provider);

    function useStateFunction<T>(initialState?: ValueOrGenerator<T>) {
      return usePersistedState<T>(key, storage, initialState);
    }

    return useStateFunction;
  }

  return useState;
};

export default createPersistedState;
export { usePersistedState };
