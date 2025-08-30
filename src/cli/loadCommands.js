// Path: src/cli/loadCommands.js
const glob = require("glob");
const path = require("path");
const logger = require("./logger");

/**
 * Loads commands from JavaScript files within a specified directory and registers them with the Commander.js program.
 * Each JavaScript file is expected to export a function that takes the program instance as an argument.
 * @param {object} program - The Commander.js program instance.
 * @param {string} commandsPath - The absolute path to the directory containing command files.
 */
function loadCommands(program, commandsPath) {
  const files = glob.sync(`${commandsPath}/**/*.js`, { absolute: true });

  files.forEach((file) => {
    try {
      const commandModule = require(file);
      if (typeof commandModule === "function") {
        commandModule(program);
      } else if (typeof commandModule.default === "function") {
        commandModule.default(program);
      }
    } catch (error) {
      logger.error(`Error loading command from file ${file}:`, error);
    }
  });
}

module.exports = { loadCommands };
