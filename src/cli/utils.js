function mergeOptions(program, commandName, options) {
  const commandConfig = program.config && program.config[commandName] ? program.config[commandName] : {};
  const merged = { ...commandConfig }; // Start with commandConfig

  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      // If the option is an array and it's not empty, or if it's not an array,
      // then overwrite the commandConfig value with the option value.
      // This ensures that default empty arrays from Commander.js don't overwrite populated config arrays.
      if (Array.isArray(options[key])) {
        if (options[key].length > 0) { // Only overwrite if the array from options is not empty
          merged[key] = options[key];
        }
      } else {
        merged[key] = options[key];
      }
    }
  }
  console.log('commandConfig:', commandConfig);
  console.log('options (from Commander.js):', options);
  console.log('Merged options in mergeOptions:', merged);
  return merged;
}

module.exports = { mergeOptions };
