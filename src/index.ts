import { useState } from 'react';

import usePersistedState from './usePersistedState';
import createStorage from './createStorage';

import { Provider } from './provider';

const createPersistedState = <T>(
  key: string,
  provider: Provider = window.localStorage
): typeof useState => {
  if (provider) {
    const storage = createStorage<T>(provider);
    return (initialState: T) => usePersistedState(initialState, key, storage);
  }

  return useState;
};

export default createPersistedState;
export { usePersistedState };
