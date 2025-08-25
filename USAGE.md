```bash

Usage: prodpage [options] [command]

A CLI tool for demonstration purposes

Options:
  -c, --config <path>          set config path (default: "./prodpage.json")
  -d, --debug                  enable debug mode
  -h, --help                   display help for command
  --silent                     enable silent mode
  -v, --verbose                enable verbose mode
  -V, --version                output the version number

Commands:
  help [command]               display help for command
  init|i [options] [filename]  Creates a configuration file
```

**`help` command:**

```bash
Usage: prodpage [options] [command]

A CLI tool for demonstration purposes

Options:
  -c, --config <path>          set config path (default: "./prodpage.json")
  -d, --debug                  enable debug mode
  -h, --help                   display help for command
  --silent                     enable silent mode
  -v, --verbose                enable verbose mode
  -V, --version                output the version number

Commands:
  help [command]               display help for command
  init|i [options] [filename]  Creates a configuration file
```

**`init` command:**

```bash
Usage: prodpage init|i [options] [filename]

Creates a configuration file

Arguments:
  filename     name of the configuration file

Options:
  -f, --force  overwrite existing configuration file
  -h, --help   display help for command
  -y, --yes    accept default values from ./config/default.json
```
