import { Command } from "commander";
import { readFile, writeFile } from "node:fs/promises";
import * as packageJson from "../../package.json";
import { setup } from "../library";
import { generateObelisqFile } from "../library/generated";
import { parseEnvironment, TEnvironmentLineKeyValue } from "../library/parser";
import spawn from "cross-spawn";

const program = new Command();

program.name("obelisq").description("Obelisq CLI").version(packageJson.version);

program
  .command("run", { isDefault: true })
  .option("-f, --file <string>", "path to environment file", ".env")
  .allowExcessArguments(true)
  .action(async (options) => {
    await setup({ file: options.file });

    if (program.args.length > 0) {
      const child = spawn(program.args[0], program.args.slice(1), {
        stdio: "inherit",
      }).on("exit", (code, signal) => {
        if (code) {
          process.exit(code);
        } else if (signal) {
          process.kill(process.pid, signal);
        }
      });

      const signals: NodeJS.Signals[] = [
        "SIGINT",
        "SIGTERM",
        "SIGPIPE",
        "SIGHUP",
        "SIGBREAK",
        "SIGWINCH",
        "SIGUSR1",
        "SIGUSR2",
      ];

      for (const signal of signals) {
        process.on(signal, function () {
          child.kill(signal);
        });
      }
    }
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
