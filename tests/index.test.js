const { exec } = require("child_process");
const path = require("path");

const cliPath = path.resolve(__dirname, "../bin/cli.js");

describe("CLI Tests", () => {
  // Test case for running with no arguments
  test("should display help message when run with no arguments", (done) => {
    exec(`node "${cliPath}"`, (error, stdout, stderr) => {
      expect(stderr.trim()).toContain("Usage: prodpage [options] [command]");
      expect(stdout).toBe("");
      done();
    });
  });

  // Test case for -h option
  test("should display help message when -h option is used", (done) => {
    exec(`node "${cliPath}" -h`, (error, stdout, stderr) => {
      expect(stdout.trim()).toContain("Usage: prodpage [options] [command]");
      expect(stderr).toBe("");
      expect(error).toBeNull();
      done();
    });
  });

  // Test case for --help option
  test("should display help message when --help option is used", (done) => {
    exec(`node "${cliPath}" --help`, (error, stdout, stderr) => {
      expect(stdout.trim()).toContain("Usage: prodpage [options] [command]");
      expect(stderr).toBe("");
      expect(error).toBeNull();
      done();
    });
  });

  // Test case for -V option
  test("should display version when -V option is used", (done) => {
    exec(`node "${cliPath}" -V`, (error, stdout, stderr) => {
      // Assuming version is in package.json and accessible
      const packageJson = require("../package.json");
      expect(stdout.trim()).toContain(packageJson.version);
      expect(stderr).toBe("");
      expect(error).toBeNull();
      done();
    });
  });

  // Test case for --version option
  test("should display version when --version option is used", (done) => {
    exec(`node "${cliPath}" --version`, (error, stdout, stderr) => {
      const packageJson = require("../package.json");
      expect(stdout.trim()).toContain(packageJson.version);
      expect(stderr).toBe("");
      expect(error).toBeNull();
      done();
    });
  });

  // Test case for checking command and global option order with -h
  test("should display commands and global options in order when -h option is used", (done) => {
    exec(`node "${cliPath}" -h`, (error, stdout, stderr) => {
      const output = stdout.trim();
      const commandIndex = output.indexOf("Commands:");
      const optionsIndex = output.indexOf("Options:");

      expect(commandIndex).toBeGreaterThan(-1);
      expect(optionsIndex).toBeGreaterThan(-1);
      expect(optionsIndex).toBeLessThan(commandIndex); // Commands should appear after Options

      expect(stderr).toBe("");
      expect(error).toBeNull();
      done();
    });
  });

  // Test case for checking command and global option order with --help
  test("should display commands and global options in order when --help option is used", (done) => {
    exec(`node "${cliPath}" --help`, (error, stdout, stderr) => {
      const output = stdout.trim();
      const commandIndex = output.indexOf("Commands:");
      const optionsIndex = output.indexOf("Options:");

      expect(commandIndex).toBeGreaterThan(-1);
      expect(optionsIndex).toBeGreaterThan(-1);
      expect(optionsIndex).toBeLessThan(commandIndex); // Commands should appear after Options

      expect(stderr).toBe("");
      expect(error).toBeNull();
      done();
    });
  });

  // Test case for checking if command options are ordered alphabetically with -h
  test("should display command options in alphabetical order when -h option is used for a command", (done) => {
    const { buildProgram } = require("../src/cli/program");
    const program = buildProgram();
    const commands = program.commands.map((cmd) => cmd.name());

    if (commands.length === 0) {
      done(); // No commands to test
      return;
    }

    const commandToTest = commands[0]; // Test the first command found

    exec(`node "${cliPath}" ${commandToTest} -h`, (error, stdout, stderr) => {
      const output = stdout.trim();
      const optionsRegex = /^\s{2}(-{1,2}[a-zA-Z0-9-]+)/gm; // Regex to capture options
      let match;
      const options = [];

      while ((match = optionsRegex.exec(output)) !== null) {
        options.push(match[1]);
      }

      // Filter out common options like -h, --help, -V, --version if they appear
      const filteredOptions = options.filter(
        (opt) => !["-h", "--help", "-V", "--version"].includes(opt),
      );

      const sortedOptions = [...filteredOptions].sort((a, b) => {
        // Custom sort to handle short options before long options if they share the same letter
        const aIsShort = a.startsWith("-") && !a.startsWith("--");
        const bIsShort = b.startsWith("-") && !b.startsWith("--");

        if (aIsShort && bIsShort) {
          return a.localeCompare(b);
        } else if (aIsShort) {
          return -1; // Short option comes before long option
        } else if (bIsShort) {
          return 1; // Long option comes after short option
        } else {
          return a.localeCompare(b);
        }
      });

      expect(filteredOptions).toEqual(sortedOptions);
      expect(stderr).toBe("");
      expect(error).toBeNull();
      done();
    });
  });

  // Test case for executing bin/cli.js with -V option
  test("should display version when bin/cli.js is executed with -V option", (done) => {
    const cliBinPath = path.resolve(__dirname, "../bin/cli.js");
    exec(`node "${cliBinPath}" -V`, (error, stdout, stderr) => {
      const packageJson = require("../package.json");
      expect(stdout.trim()).toContain(packageJson.version);
      expect(stderr).toBe("");
      expect(error).toBeNull();
      done();
    });
  });
});
