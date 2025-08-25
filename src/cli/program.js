function buildProgram() {
  const { Command } = require("commander");
  const program = new Command();
  const pkg = require("../../package.json");
  const { version } = pkg;

  program
    .name("prodpage")
    .description("A CLI tool for demonstration purposes")
    .version(version)
    .option("-d, --debug", "enable debug mode")
    .option("-c, --config <path>", "set config path", "./config.json")
    .configureHelp({
      sortSubcommands: true,
      sortOptions: true,
    })

  program
    .command("start")
    .description("Start the application")
    .option("-f, --force", "force start the application")
    .option("-a, --all", "start all services")
    .action(() => {
      console.log("Application started");
      if (program.opts().debug) {
        console.log("Debug mode is enabled");
      }
      console.log(`Using config file: ${program.opts().config}`);
    });

  program
    .command("stop")
    .description("Stop the application")
    .action(() => {
      console.log("Application stopped");
    });

  return program;
}

module.exports = { buildProgram };