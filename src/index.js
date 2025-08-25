const { buildProgram } = require("./cli/program");

function run() {
  const program = buildProgram();
  program.parse(process.argv);

  // If no arguments are provided, display help
  if (process.argv.length < 3) {
    program.help();
  }
}

run();

module.exports = { run };
