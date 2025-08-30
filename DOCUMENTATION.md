# CLI Documentation

This document provides an overview of the CLI tool, its global options, configuration, and available commands.

## Global Options

The following options are available for all commands:

- `-c, --config <path>`: Set the path to the configuration file. Defaults to `./prodpage.json`.
- `-d, --debug`: Enable debug mode. This will print additional debug information to the console.
- `--silent`: Suppress all output except for errors.
- `-v, --verbose`: Enable verbose mode. (Currently not implemented, but reserved for future use).

## Configuration

The CLI uses a cascading configuration system. The settings are merged in the following order of precedence (lowest to highest):

1.  **Default Configuration:** Located at `config/default.json`.
2.  **User Configuration:** Specified by the `--config` option or located at the root of the project as `prodpage.json`.
3.  **Command-Line Options:** Any options passed directly on the command line will override the settings from the configuration files.

Configuration settings are organized by command. This means that options specific to a command (like `build` or `init`) are nested under a key with the command's name. Global options, such as `debug`, `verbose`, and `silent`, are defined at the top level of the configuration file.

### Default Configuration

The `config/default.json` file in the repository contains the default settings for the CLI. These settings are used as a fallback when no other configuration is provided.

```json
{
  "debug": false,
  "silent": false,
  "verbose": false,
  "build": {
    "docs": "website/docs",
    "ignore": [
      "**/node_modules/**",
      "**/.git/**",
      "**/build/**",
      "**/dist/**",
      "**/out/**",
      "**/.vscode/**",
      "**/temp/**",
      "**/tmp/**",
      "**/coverage/**",
      "**/package-lock.json"
    ],
    "output": "dist",
    "patterns": ["**/*.products.json", "__products__/**/*.json"],
    "productsIndex": "index.md",
    "sidebars": "website/sidebars.js",
    "templateFiles": {
      "product": "product.hbs",
      "productIndex": "product-index.hbs"
    },
    "templates": "templates",
    "watch": false
  },
  "init": {
    "force": false,
    "yes": false
  }
}
```

### Local Configuration Example

You can create a `prodpage.json` file in your project's root directory to override the default settings. This file can override both global options and command-specific settings. For example:

```json
{
  "debug": true,
  "build": {
    "patterns": ["my-products/**/*.json"],
    "docs": "my-docs",
    "templates": "my-templates"
  }
}
```

This configuration would enable debug mode globally and change the search patterns for product files, the output directory for documentation, and the location of the templates for the `build` command.

## Commands

### `build`

Builds the project by generating Markdown files from product data.

**Alias:** `b`

**Arguments:**

- `[patterns...]`: Optional list of product list filename patterns. If not provided, the patterns from the configuration file will be used.

**Options:**

- `--featured-menu`: Generate menu items for featured products.
- `-d, --docs <path>`: Path to where the products index page will go. Defaults to `website/docs`.
- `-i, --ignore <patterns...>`: Patterns of files to ignore when matching files to retrieve.
- `-p, --products-index <filename>`: The filename for the products index. Defaults to `index.md`.
- `-s, --sidebars <file>`: Path and name of the sidebars file in `.js` where the build will add the entry to the products index page. Defaults to `website/sidebars.js`.
- `-t, --templates <path>`: Folder where template files are stored. Defaults to `templates`.

**Examples:**

```bash
# Build using the configuration file
prodpage build

# Build using a specific pattern
prodpage build "**/__products__/*.json"

# Build and generate a menu for featured products
prodpage build --featured-menu
```

### `init`

Creates a configuration file.

**Alias:** `i`

**Arguments:**

- `[filename]`: Optional name of the configuration file. Defaults to `prodpage.json`.

**Options:**

- `-f, --force`: Overwrite an existing configuration file.
- `-y, --yes`: Accept default values from `./config/default.json`.

**Examples:**

```bash
# Create a default configuration file
prodpage init

# Create a configuration file with a custom name
prodpage init my-config.json

# Create a configuration file with default values
prodpage init -y
```

## Product List Schema

Product definitions appear in product list files. Product list files are `.json` file containing an array of product definition items. To ensure product list files meet design specifications, a `schema.json` file contains the validation schema.

The schema specifies that a product can be a simple string (which will be treated as the product\'s label) or an object with the following properties:

- `label` (required): The display name of the product.
- `productId`: A unique identifier for the product, used for generating URLs and file paths.
- `docLink`: The URL to the main documentation page for the product.
- `description`: A brief description of the product.
- `featured`: A boolean value that indicates whether the product should be included in the main navigation menu when the `--featured-menu` flag is present in the `build` command.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "uniqueItems": true,
  "items": {
    "oneOf": [
      {
        "type": "string"
      },
      {
        "type": "object",
        "properties": {
          "label": {
            "type": "string",
            "pattern": "^\\s*([a-zA-Z0-9]+\\s)*[a-zA-Z0-9]+\\s*$"
          },
          "productId": {
            "type": "string",
            "pattern": "^[a-z]+([-]?[a-z0-9]+)*$"
          },
          "docLink": {
            "type": "string",
            "pattern": "^([a-z]+([-]?[a-z0-9]+)*\\/)*[a-z]+([-]?[a-z0-9]+)*$"
          },
          "description": {
            "type": "string"
          },
          "featured": {
            "type": "boolean"
          }
        },
        "required": ["label"],
        "additionalProperties": true
      }
    ]
  }
}
```

| Property    | Description                                           | Default               | Example                  |
| :---------- | :---------------------------------------------------- | :-------------------- | :----------------------- |
| `label`     | Human readable product label identifying the product  |                       | `"Product One"`          |
| `productId` | product slug string                                   | slug of `label` value | `product-one`            |
| `docLink`   | Link to the main product documentation page           | `productId` value     | `"product-one/overview"` |
| `featured`  | Whether to include the product in the navigation menu | `false`               | `true`                   |

### Product list file examples

```json
[
  "Product One",
  {
    "label": "Product Two",
    "productId": "product-two",
    "docLink": "product-two/overview",
    "featured": true
  },
  {
    "label": "Product Three",
    "featured": false
  },
  {
    "label": "Product Four"
  }
]
```
