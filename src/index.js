function buildProgram() {
  const { Command } = require("commander");
  const program = new Command();
  const pkg = require("../package.json");
  const { version } = pkg;

  program
    .name("prodpage")
    .description("A CLI tool for demonstration purposes")
    .version(version)
    .option("-d, --debug", "enable debug mode")
    .option("-c, --config <path>", "set config path", "./config.json");

  program
    .command("start")
    .description("Start the application")
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

    function run() {
    const program = buildProgram();
    program.parse(process.argv);

    // If no arguments are provided, display help
    if (process.argv.length < 3) {
      program.help();
    }
  }

  run();

module.exports = { buildProgram, run };
