const fs = require("fs");
const path = require("path");

module.exports = (program) => {
  program
    .command("init")
    .alias("i")
    .description("Creates a configuration file")
    .argument("[filename]", "name of the configuration file")
    .option("-y, --yes", "accept default values from ./config/default.json")
    .option("-f, --force", "overwrite existing configuration file")
    .action((filename, options) => {
      const defaultConfigFile = `${program.name()}.json`;
      const configFileName = filename || defaultConfigFile;
      const configFilePath = path.resolve(process.cwd(), configFileName);

      if (options.yes) {
        const defaultConfigPath = path.resolve(
          __dirname,
          "../../config/default.json",
        );
        fs.readFile(defaultConfigPath, "utf8", (err, data) => {
          if (err) {
            console.error(`Error reading default config file: ${err.message}`);
            return;
          }
          fs.writeFile(configFilePath, data, (err) => {
            if (err) {
              console.error(`Error writing config file: ${err.message}`);
              return;
            }
            console.log(
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
            console.error(`Error writing config file: ${err.message}`);
            return;
          }
          console.log(`Configuration file created at: ${configFilePath}.`);
        });
      }
    });
};
