import { TEnvironmentLineKeyValue } from "./parser";

type TExtendEnvironmentParams = {
  entries: TEnvironmentLineKeyValue[];
};

export const extendEnvironment = async ({
  entries,
}: TExtendEnvironmentParams) => {
  for (const { key, value } of entries) {
    process.env[key] = value;
  }
};
