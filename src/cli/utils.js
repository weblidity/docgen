const logger = require("./logger");

function mergeOptions(program, commandName, options, command) {
  const commandConfig =
    program.config && program.config[commandName]
      ? program.config[commandName]
      : {};

  // Start with default options from commander
  const merged = { ...options };

  // Merge config file values
  for (const key in commandConfig) {
    if (commandConfig.hasOwnProperty(key)) {
      // If the option was not provided on the command line,
      // then the config file value takes precedence.
      const source = command.getOptionValueSource(key);
      if (source !== "cli") {
        merged[key] = commandConfig[key];
      }
    }
  }
  logger.debug("commandConfig:", commandConfig);
  logger.debug("options (from Commander.js):", options);
  logger.debug("Merged options in mergeOptions:", merged);
  return merged;
}

module.exports = { mergeOptions };
