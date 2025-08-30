// Path: src/index.js
const { buildProgram } = require("./cli/program");

/**
 * Runs the CLI application.
 * It builds the program, parses command-line arguments, and displays help if no arguments are provided.
 */
function run() {
  const program = buildProgram();
  program.parse(process.argv);

  // If no arguments are provided, display help
  if (process.argv.length < 3) {
    program.help();
  }
}

module.exports = { run };
