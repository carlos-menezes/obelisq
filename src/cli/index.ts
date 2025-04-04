import { Command } from "commander";
import * as packageJson from "../../package.json";
import { setup } from "../library";

const program = new Command();

program.name("obelisq").description("Obelisq CLI").version(packageJson.version);

program
  .command("run", { isDefault: true })
  .option("-f, --file <string>", "path to environment file", ".env")
  .action(async (options) => {
    await setup({ file: options.file });
  });

program.parse();
