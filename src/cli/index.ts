import { Command } from "commander";
import * as packageJson from "../../package.json";
import { setup } from "../library";
import { generateObelisqFile } from "../library/generated";
import { readFile, writeFile } from "node:fs/promises";
import { parseEnvironment, TEnvironmentLineKeyValue } from "../library/parser";

const program = new Command();

program.name("obelisq").description("Obelisq CLI").version(packageJson.version);

program
  .command("run", { isDefault: true })
  .option("-f, --file <string>", "path to environment file", ".env")
  .action(async (options) => {
    await setup({ file: options.file });
  });

program
  .command("generate")
  .option("-o, --output <string>", "path to output file")
  .action(async (options) => {
    const content = (await readFile(".env", { encoding: "utf-8" })).split("\n");
    const parsedLines = await parseEnvironment({ content });

    const entries = parsedLines.filter(
      (entry) => entry.kind === "key-value"
    ) as TEnvironmentLineKeyValue[];

    const outputPath = options.output || "obelisq.ts";

    await writeFile(outputPath, Buffer.from(generateObelisqFile({ entries })));
  });

program.parse();
