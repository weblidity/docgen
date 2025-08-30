// Path: src/commands/init.js
const fs = require("fs");
const path = require("path");
const { mergeOptions } = require("../cli/utils"); // Import mergeOptions
const logger = require("../cli/logger");

/**
 * Defines the 'init' command for the CLI.
 * This command creates a configuration file, optionally with default values or a custom filename.
 * @param {object} program - The Commander.js program instance.
 */
module.exports = (program) => {
  program
    .command("init")
    .alias("i")
    .description("Creates a configuration file")
    .argument("[filename]", "name of the configuration file")
    .option("-y, --yes", "accept default values from ./config/default.json")
    .option("-f, --force", "overwrite existing configuration file")
    .action((filename, options) => {
      const mergedOptions = mergeOptions(program, "init", options);
      const configFilePath = filename || program.opts().config;

      if (mergedOptions.yes) {
        const defaultConfigPath = path.resolve(
          __dirname,
          "../../config/default.json",
        );
        fs.readFile(defaultConfigPath, "utf8", (err, data) => {
          if (err) {
            logger.error(`Error reading default config file: ${err.message}`);
            return;
          }
          fs.writeFile(configFilePath, data, (err) => {
            if (err) {
              logger.error(`Error writing config file: ${err.message}`);
              return;
            }
            logger.success(
              `Configuration file created at: ${configFilePath} with default values.`,
            );
          });
        });
      } else {
        // For now, if -y is not used, create an empty JSON file.
        // In a real scenario, this would involve interactive prompts.
        const emptyConfig = JSON.stringify({}, null, 2);
        fs.writeFile(configFilePath, emptyConfig, (err) => {
          if (err) {
            logger.error(`Error writing config file: ${err.message}`);
            return;
          }
          logger.success(`Configuration file created at: ${configFilePath}.`);
        });
      }
    });
};
