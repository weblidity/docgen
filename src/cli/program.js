// Path: src/cli/program.js
const { Command } = require("commander");
const path = require("path");
const { loadCommands } = require("./loadCommands");
const { loadConfig } = require("./configLoader"); // Import loadConfig

/**
 * Builds the Commander.js program instance for the CLI.
 * It sets up the program's name, description, version, global options, and loads commands.
 * @returns {object} The Commander.js program instance.
 */
function buildProgram() {
  const program = new Command();
  const pkg = require("../../package.json");
  const { version } = pkg;
  const nameWithoutCli = pkg.name.replace(/-cli$/, "");

  program
    .name(nameWithoutCli)
    .description("A CLI tool for demonstration purposes")
    .version(version)
    .option("-d, --debug", "enable debug mode")
    .option("-v, --verbose", "enable verbose mode")
    .option("--silent", "enable silent mode")
    .option(
      "-c, --config <path>",
      "set config path",
      `./${program.name()}.json`,
    )
    .configureHelp({
      sortSubcommands: true,
      sortOptions: true,
    });

  // Load configuration using preAction hook
  program.hook("preAction", (thisCommand, actionCommand) => {
    const configOption = thisCommand.opts().config;
    const userConfigPath = configOption
      ? path.resolve(process.cwd(), configOption)
      : undefined;

    program.config = loadConfig(
      path.resolve(__dirname, "../../config/default.json"),
      userConfigPath,
    );
  });

  loadCommands(program, path.resolve(__dirname, "../commands"));

  return program;
}

module.exports = { buildProgram };
