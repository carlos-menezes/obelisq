import z from "zod";
import { TEnvironmentLineKeyValue } from "./parser";

type TObelisqEnvironmentKeys = {
  A: string;
  B: number;
};

const environment = <TKey extends keyof TObelisqEnvironmentKeys>(key: TKey) => {
  return process.env[key as string] as TObelisqEnvironmentKeys[TKey];
};

const a = environment("A");
const b = environment("B");

type TGenerateObelisqFileParams = {
  entries: TEnvironmentLineKeyValue[];
};

type TAssumeValueTypeParams = {
  value: string;
};

const assumeValueType = ({ value }: TAssumeValueTypeParams) => {
  if (z.boolean().safeParse(value).success) {
    return "boolean";
  }

  if (z.number().safeParse(Number(value)).success) {
    return "number";
  }

  if (z.string().safeParse(value).success) {
    return "string";
  }

  throw new Error(`Unable to determine type for value: ${value}`);
};

const generateEnvironmentKeysType = ({
  entries,
}: Pick<TGenerateObelisqFileParams, "entries">) => {
  return `type TObelisqEnvironmentKeys = {
  ${entries
    .map(({ key, value }) => `${key}: ${assumeValueType({ value })};`)
    .join("\n  ")}
};`;
};

export const generateObelisqFile = ({
  entries,
}: TGenerateObelisqFileParams) => {
  return `${generateEnvironmentKeysType({ entries })}

export const environment = <TKey extends keyof TObelisqEnvironmentKeys>(key: TKey) => {
    return process.env[key as string] as TObelisqEnvironmentKeys[TKey];
};
  `;
};
