import { useState, useEffect, useRef, useCallback } from 'react';

import useEventListener from 'use-typed-event-listener';

import ValueOrFunction from './valueOrFunction';
import createGlobalState from './createGlobalState';
import { ObjectStorage } from './objectStorage';

const usePersistedState = <T>(
  initialState: T,
  key: string,
  storage: ObjectStorage<T>
) => {
  const globalState = useRef<T | null>(null);
  const [state, setState] = useState(() => storage.get(key, initialState));

  // subscribe to `storage` change events
  useEventListener('storage', ({ key: k, newValue }) => {
    if (k === key) {
      const newState = JSON.parse(newValue);
      if (state !== newState) {
        setState(newState);
      }
    }
  });

  // only called on mount
  useEffect(() => {
    // register a listener that calls `setState` when another instance emits
    globalState.current = createGlobalState(key, setState, initialState);

    return () => {
      globalState.current.deregister();
    };
  }, []);

  const persistentSetState = useCallback(
    (newState: T | ((arg0: T) => T)) => {
      const newStateValue =
        typeof newState === 'function' ? newState(state) : newState;

      // persist to localStorage
      storage.set(key, newStateValue);

      setState(newStateValue);

      // inform all of the other instances in this tab
      globalState.current.emit(newStateValue);
    },
    [state, storage.set, key]
  );

  return [state, persistentSetState];
};

export default usePersistedState;
