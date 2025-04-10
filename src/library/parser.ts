import { resolveEnvironmentVariables } from "./resolver";

type TMetadataType = "string" | "number" | "boolean";

export type TParseEnvironmentLineReturnType =
  | {
      /**
       * A comment line is reserved for future use. Although not implemented right now,
       * it may be used to provide type hints for the environment variables which helps during generation.
       */
      kind: "comment";
      key?: never;
      value: string;
      metadata?: never;
    }
  | {
      kind: "key-value";
      key: string;
      value: string;
      metadata: {
        type: TMetadataType;
      };
    }
  | {
      kind: "empty";
      key?: never;
      value?: never;
      metadata?: never;
    };

export type TEnvironmentLineComment = Extract<
  TParseEnvironmentLineReturnType,
  { kind: "comment" }
>;

export type TEnvironmentLineKeyValue = Extract<
  TParseEnvironmentLineReturnType,
  { kind: "key-value" }
>;

export type TEnvironmentLineEmpty = Extract<
  TParseEnvironmentLineReturnType,
  { kind: "empty" }
>;

type TParseEnvironmentParams = {
  content: string[];
};

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

const parseComment = (line: string): TEnvironmentLineComment => {
  const value = line.slice(1).trim();

  return {
    kind: "comment",
    value,
  };
};

const parseKeyValue = (line: string): TEnvironmentLineKeyValue => {
  const [key, ...valueParts] = line.split("=");
  const value = valueParts.join("=").trim();

  if (!key || !value) {
    throw new Error('Malformed environment line (expected "key=value")');
  }

  return {
    kind: "key-value",
    key: key.trim(),
    value: value.trim(),
    metadata: {
      type: assumeValueType({ value }),
    },
  };
};

const parseEnvironmentLine = async (
  line: string,
): Promise<TParseEnvironmentLineReturnType> => {
  const sanitized = line.trim();

  if (sanitized.startsWith("#")) return parseComment(sanitized);

  if (sanitized === "") {
    return {
      kind: "empty",
    };
  }

  return parseKeyValue(sanitized);
};

export const parseEnvironment = async ({
  content,
}: TParseEnvironmentParams): Promise<TParseEnvironmentLineReturnType[]> =>
  resolveEnvironmentVariables({
    entries: await Promise.all(content.map(parseEnvironmentLine)),
  });
