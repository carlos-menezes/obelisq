import { TParseEnvironmentReturnType } from "./parser";

type TResolveEnvironmentVariablesParams = {
  entries: TParseEnvironmentReturnType;
};

const TEMPLATE_VARIABLE_REGEX = new RegExp(/\$\{([\w]+)\}/g);

export const resolveEnvironmentVariables = async ({
  entries,
}: TResolveEnvironmentVariablesParams): Promise<TParseEnvironmentReturnType> => {
  return Object.fromEntries(
    Object.entries(entries).map(([key, { metadata, value }]) => [
      key,
      {
        metadata,
        value: value.replace(TEMPLATE_VARIABLE_REGEX, (_, variable) => {
          const entry = entries[variable];
          if (!entry) {
            throw new Error(
              `Environment variable "${variable}" not found while resolving "${key}=${value}"`,
            );
          }
          return entry.value;
        }),
      },
    ]),
  );
};
