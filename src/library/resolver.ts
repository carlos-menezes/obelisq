import { TParseEnvironmentLineReturnType } from "./parser";

type TResolveEnvironmentVariablesParams = {
  entries: TParseEnvironmentLineReturnType[];
};

export const resolveEnvironmentVariables = async ({
  entries,
}: TResolveEnvironmentVariablesParams): Promise<
  TParseEnvironmentLineReturnType[]
> =>
  entries.map((entry) => {
    if (entry.kind !== "key-value") return entry;

    const resolvedValue = entry.value?.replace(
      /\$\{([\w]+)\}/g,
      (_, variable) => {
        const entry = entries.find(
          (entry) => entry.kind === "key-value" && entry.key === variable
        );

        if (!entry || !entry.value) {
          throw new Error(
            `Environment variable "${entry}" not found while resolving "${entry?.key}=${entry?.value}"`
          );
        }

        return entry.value;
      }
    );

    return {
      ...entry,
      value: resolvedValue,
      metadata: {
        ...entry.metadata,
      },
    };
  });
