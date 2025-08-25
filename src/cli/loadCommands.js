const glob = require("glob");
const path = require("path");

function loadCommands(program, commandsPath) {
  const files = glob.sync(`${commandsPath}/**/*.js`, { absolute: true });

  files.forEach((file) => {
    const commandModule = require(file);
    if (typeof commandModule === "function") {
      commandModule(program);
    } else if (typeof commandModule.default === "function") {
      commandModule.default(program);
    }
  });
}

module.exports = { loadCommands };
