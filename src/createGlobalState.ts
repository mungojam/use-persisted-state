type Callback<T> = (arg0: T) => void;

const globalState: Record<string, {callbacks: Callback<any>[], value: any}> = {};

export interface GlobalStateRegistration<T> {
  deregister: () => void, 
  emit: (value: T) => void
}

const createGlobalState = <T>(key: string, thisCallback: Callback<T>, initialValue?: T): GlobalStateRegistration<T> => {
  if (!globalState[key]) {
    globalState[key] = { callbacks: [], value: initialValue };
  }

  globalState[key].callbacks.push(thisCallback);

  return {
    deregister() {
      const arr = globalState[key].callbacks;
      const index = arr.indexOf(thisCallback);
      if (index > -1) {
        arr.splice(index, 1);
      }
    },
    emit(value: T) {
      if (globalState[key].value !== value) {
        globalState[key].value = value;
        globalState[key].callbacks.forEach((callback) => {
          if (thisCallback !== callback) {
            callback(value);
          }
        });
      }
    },
  };
};

export default createGlobalState;
