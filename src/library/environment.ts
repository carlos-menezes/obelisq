import { TEnvironmentLineKeyValue } from "./parser";

type TExtendEnvironmentParams = {
  entries: TEnvironmentLineKeyValue[];
};

export const extendEnvironment = async ({
  entries,
}: TExtendEnvironmentParams) => {
  for (const [index, { key, value }] of entries.entries()) {
    process.env[key] = value;
  }
};
