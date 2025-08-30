const chalk = require("chalk");

let program;

function setProgram(p) {
  program = p;
}

function getOptions() {
  return program ? program.opts() : {};
}

function info(...args) {
  const options = getOptions();
  if (options.silent) return;
  console.log(...args);
}

function warn(...args) {
  const options = getOptions();
  if (options.silent) return;
  console.warn(chalk.yellow(...args));
}

function error(...args) {
  const options = getOptions();
  if (options.silent) return;
  console.error(chalk.red(...args));
}

function debug(...args) {
  const options = getOptions();
  if (options.silent) return;
  if (options.debug) {
    console.log(chalk.blue(...args));
  }
}

function success(...args) {
  const options = getOptions();
  if (options.silent) return;
  console.log(chalk.green(...args));
}

module.exports = {
  setProgram,
  info,
  warn,
  error,
  debug,
  success,
};
