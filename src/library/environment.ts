import { TParseEnvironmentReturnType } from "./parser";

type TExtendEnvironmentParams = {
  entries: TParseEnvironmentReturnType;
};

export const extendEnvironment = async ({
  entries,
}: TExtendEnvironmentParams) => {
  for (const key in entries) {
    const { value } = entries[key];
    process.env[key] = value;
  }
};
