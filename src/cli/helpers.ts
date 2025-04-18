export const repeatable = (value: string, previous: string[]) => {
  const set = new Set(previous);
  set.add(value);
  return Array.from(set);
};
