import { PathLike } from "node:fs";
import { readFile } from "node:fs/promises";
import { parseEnvironment, TParseEnvironmentReturnType } from "./parser";
import { extendEnvironment } from "./environment";

type TSetupParams = {
  files: PathLike[];
};

export const setup = async (
  options: TSetupParams,
): Promise<TParseEnvironmentReturnType> => {
  const mergedFilesContent = (
    await Promise.all(
      options.files.map(async (file) => {
        const content = (await readFile(file, { encoding: "utf-8" })).split(
          "\n",
        );
        return content;
      }),
    )
  ).flat();

  const entries = await parseEnvironment({
    content: mergedFilesContent,
  });
  await extendEnvironment({ entries });

  return entries;
};
