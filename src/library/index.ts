import { PathLike } from "node:fs";
import { readFile } from "node:fs/promises";
import { parseEnvironment, TEnvironmentLineKeyValue } from "./parser";
import { extendEnvironment } from "./environment";

type TSetupParams = {
  file: PathLike;
};

export const setup = async ({ file }: TSetupParams) => {
  const content = (await readFile(".env", { encoding: "utf-8" })).split("\n");
  const parsedLines = await parseEnvironment({ content });

  /**
   * Filter out comments and empty lines.
   * As noted in `parseEnvironment`, the return type is a union of all possible line types.
   * We may eventually use the other types, but for now we only care about key-value pairs.
   */
  const entries = parsedLines.filter(
    (entry) => entry.kind === "key-value"
  ) as TEnvironmentLineKeyValue[];

  await extendEnvironment({ entries });

  console.log(process.env);
};
