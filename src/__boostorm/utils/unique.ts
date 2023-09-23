export const Unique = <T, K extends keyof T>(arr: Array<T>, key: K) => {
  const result: Array<T> = [];
  const keys: Array<unknown> = [];
  for (const el of arr) {
    if (!keys.includes(el[key])) {
      keys.push(el[key]);
      result.push(el);
    }
  }
  return result;
};
