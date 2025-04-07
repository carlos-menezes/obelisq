import { resolveEnvironmentVariables } from "./resolver";

type TMetadataType = "string" | "number" | "boolean";

export type TKeyValue = {
  key: string;
  value: string;
  metadata: {
    type: TMetadataType;
  };
};

type TParseEnvironmentParams = {
  content: string[];
};

export type TParseEnvironmentReturnType = Record<
  string,
  Pick<TKeyValue, "metadata" | "value">
>;

type TAssumeValueTypeParams = {
  value: string;
};

const assumeValueType = ({ value }: TAssumeValueTypeParams): TMetadataType => {
  const lower = value.toLowerCase();

  // Check for boolean
  if (lower === "true" || lower === "false") {
    return "boolean";
  }

  // Check for number (must be a valid finite number)
  if (!isNaN(Number(value)) && isFinite(Number(value))) {
    return "number";
  }

  // Fallback to string
  return "string";
};

const parseKeyValue = (line: string): TKeyValue => {
  const [key, ...valueParts] = line.split("=");
  const value = valueParts.join("=").trim();

  if (!key || !value) {
    throw new Error('Malformed environment line (expected "key=value")');
  }

  return {
    key: key.trim(),
    value: value.trim(),
    metadata: {
      type: assumeValueType({ value }),
    },
  };
};

export const parseEnvironment = async ({
  content,
}: TParseEnvironmentParams): Promise<TParseEnvironmentReturnType> => {
  // Remove empty lines and comments
  const sanitizedLines = content.filter(
    (line) => line.trim() !== "" && line.trim().startsWith("#"),
  );

  const entries: TParseEnvironmentReturnType = {};

  for (const line of sanitizedLines) {
    const { key, ...rest } = parseKeyValue(line);
    entries[key] = rest;
  }

  return await resolveEnvironmentVariables({
    entries,
  });
};
