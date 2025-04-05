import { TEnvironmentLineKeyValue } from "./parser";

type TGenerateObelisqFileParams = {
  entries: TEnvironmentLineKeyValue[];
};

const generateEnvironmentKeysType = ({
  entries,
}: Pick<TGenerateObelisqFileParams, "entries">) => {
  return `type TObelisqEnvironmentKeys = {
  ${entries
    .map(({ key, metadata }) => `${key}: ${metadata.type};`)
    .join("\n  ")}
};`;
};

export const generateObelisqFile = ({
  entries,
}: TGenerateObelisqFileParams) => {
  return `${generateEnvironmentKeysType({ entries })}

export const environment = <TKey extends keyof TObelisqEnvironmentKeys>(key: TKey) => {
    return process.env[key as string] as TObelisqEnvironmentKeys[TKey];
};`;
};
