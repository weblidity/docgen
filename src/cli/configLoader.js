const fs = require("fs");
const path = require("path");

function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === "object" &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        target[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function loadConfig(defaultConfigPath, userConfigPath) {
  let defaultConfig = {};
  let userConfig = {};

  if (fs.existsSync(defaultConfigPath)) {
    try {
      defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, "utf8"));
      console.log("Loaded default config:", defaultConfig);
    } catch (e) {
      console.error(
        `Error parsing default config file ${defaultConfigPath}: ${e.message}`,
      );
    }
  }

  if (userConfigPath && fs.existsSync(userConfigPath)) {
    try {
      userConfig = JSON.parse(fs.readFileSync(userConfigPath, "utf8"));
      console.log("Loaded user config:", userConfig);
    } catch (e) {
      console.error(
        `Error parsing user config file ${userConfigPath}: ${e.message}`,
      );
    }
  }

  const merged = deepMerge(defaultConfig, userConfig);
  console.log("Merged config:", merged);
  return merged;
}

module.exports = { loadConfig };
