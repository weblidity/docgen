const { Command } = require("commander");
const path = require("path");
const { loadCommands } = require("./loadCommands");

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

  loadCommands(program, path.resolve(__dirname, "../commands"));

  return program;
}

module.exports = { buildProgram };
