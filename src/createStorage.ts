const createStorage = (provider) => ({
  get(key: string, defaultValue: () => unknown | unknown) {
    const json = provider.getItem(key);

    return json === null
      ? typeof defaultValue === 'function'
        ? defaultValue()
        : defaultValue
      : JSON.parse(json);
  },
  set(key: string, value: unknown) {
    provider.setItem(key, JSON.stringify(value));
  },
});

export default createStorage;
