import { useState, useEffect, useRef, useCallback } from 'react';

import useEventListener from 'use-typed-event-listener';

import { isValue, ValueOrGenerator } from './valueOrFunction';
import createGlobalState, {
  GlobalStateRegistration,
} from './createGlobalState';
import { ObjectStorage } from './objectStorage';

function usePersistedState<T>(
  key: string,
  storage: ObjectStorage<T>,
  initialState?: ValueOrGenerator<T>
): [T | undefined, (newState: T | ((prevState: T | undefined) => T)) => void] {
  const globalState = useRef<GlobalStateRegistration<T> | null>(null);

  const [state, setState] = useState(() => {
    if (initialState === undefined) {
      return storage.get(key);
    }

    const actualInitialState = isValue(initialState)
      ? initialState
      : initialState();

    return storage.getOrSet(key, actualInitialState);
  });

  // subscribe to `storage` change events
  useEventListener(window, 'storage', ({ key: k, newValue }) => {
    console.debug(`new value for '${k}' : '${newValue}'`);
    if (k === key) {
      const newState = newValue === null ? null : JSON.parse(newValue);

      if (state !== newState) {
        setState(newState);
      }
    }
  });

  // only called on mount
  useEffect(() => {
    var storedInitialState = storage.get(key);

    // register a listener that calls `setState` when another instance emits
    const registration = createGlobalState<T>(
      key,
      setState,
      storedInitialState
    );
    globalState.current = registration;

    return () => {
      registration.deregister();
    };
  }, []);

  const persistentSetState = useCallback(
    (newState: T | ((prevState: T | undefined) => T)) => {
      const newStateValue = isValue(newState) ? newState : newState(state);

      // persist to localStorage
      storage.set(key, newStateValue);

      setState(newStateValue);

      // inform all of the other instances in this tab
      globalState.current?.emit(newStateValue);
    },
    [state, storage.set, key]
  );

  return [state, persistentSetState];
}

export default usePersistedState;
