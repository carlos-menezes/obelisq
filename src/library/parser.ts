export type TParseEnvironmentLineReturnType =
  | {
      /**
       * A comment line is reserved for future use. Although not implemented right now,
       * it may be used to provide type hints for the environment variables which helps during generation.
       */
      kind: "comment";
      key?: never;
      value: string;
    }
  | {
      kind: "key-value";
      key: string;
      value: string;
    }
  | {
      kind: "empty";
      key?: never;
      value?: never;
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
  };
};

const parseEnvironmentLine = async (
  line: string
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
}: TParseEnvironmentParams): Promise<TParseEnvironmentLineReturnType[]> => {
  return Promise.all(content.map(parseEnvironmentLine));
};
