type TObelisqEnvironmentKeys = {
  ABC: string;
  DEF: number;
};

export const environment = <TKey extends keyof TObelisqEnvironmentKeys>(
  key: TKey
) => {
  return process.env[key as string] as TObelisqEnvironmentKeys[TKey];
};
