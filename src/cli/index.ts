import { Command } from "commander";
import spawn from "cross-spawn";
import { writeFile } from "node:fs/promises";
import * as packageJson from "../../package.json";
import { setup } from "../library";
import { generateObelisqFile } from "../library/generated";
import { repeatable } from "./helpers";

const program = new Command();

program.name("obelisq").description("Obelisq CLI").version(packageJson.version);

program
  .command("run", { isDefault: true })
  .requiredOption(
    "-f, --file <string>",
    "paths to environment files",
    repeatable,
  )
  .option("-s, --spawn <string>", "spawn a process with the given command")
  .allowExcessArguments(true)
  .action(async (options) => {
    await setup({ files: options.file });

    if (options.spawn) {
      const parts = options.spawn.split(" ");
      const child = spawn(parts[0], parts.slice(1), {
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
  .option("-o, --output <string>", "path to output file", "obelisq.ts")
  .requiredOption("-f, --file <string>", "path to environment file", repeatable)
  .action(async (options) => {
    const entries = await setup({ files: options.file });

    await writeFile(
      options.output,
      Buffer.from(generateObelisqFile({ entries })),
    );
  });

program.parse();
