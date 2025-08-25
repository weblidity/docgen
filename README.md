<p align="center">
  <a href="">
 <img width=200px height=200px src="https://i.imgur.com/0Axr7in.jpg" alt="prodpage-cli Project Logo"></a>
</p>

<h1 align="center">Prodpage CLI</h1>
<h2 align="center">Code name: <code>prodpage</code></h2>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)][![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fweblidity%2Fdocgen.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fweblidity%2Fdocgen?ref=badge_shield)
() ![NPM Version](https://img.shields.io/npm/v/prodpage-cli)
[![GitHub Issues](https://img.shields.io/github/issues/weblidity/docgen.svg)](https://github.com/weblidity/docgen/issues) [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/weblidity/docgen.svg)](https://github.com/weblidity/docgen/pulls) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

## Description

CLI tool generating documentation files and folders for multiple projects on a Docusaurus-powered site. It helps in scaffolding the documentation structure, validating product list files, and managing configuration.

## Features

- **Documentation Scaffolding**: Build files and folders for company product documentation structure for a Docusaurus-powered site.
- **Product List Validation**: Check valid structure of product list files against a defined schema.
- **Configuration Management**: Create and manage configuration files for the CLI.
- **Extensible Commands**: Easily add new commands to the CLI.

## Installation

Install the package locally using the global switch.

```bash
npm install prodpage-cli -g
```

After installing it locally, you can use from any folder on your computer. Check `prodpage-cli` is available:

```bash
prodpage-cli -V
# output
# 1.0.3
```

Alternatively, run `prodpage-cli` without installing it locally (recommended).

```bash
npx prodpage-cli -V
```

## Usage

General usage of the CLI:

```bash
prodpage [options] [command]
```

### Global Options

- `-h, --help` - provide application help.
- `-V, --version` -- provide current application version.

### Commands

#### `build` command

This is the default command, i.e. this is the command executed when no command appears on the command line.

1. **Retrieves product list** files using patterns in the arguments or default patterns.
2. **Collect product definitions** from each product list file.
3. For each product defined, generate a **product folder** under `docs` and **an `index.md` file** inside each product folder.
4. **In the `docs` folder, generate `index.md`** containing a list of products and links to product index page.
5. **Generate an `.outline.yaml`** that you will use with `Skelo CLI` to complete the documentation start-up.

##### Usage

```bash
prodpage-cli [build] [patterns...] [options]
```

##### Arguments

- `[patterns...]` - optional list of product list filename patterns

##### Options

- `-d, --docs <path>` - path to Docusaurus docs folder. (default: `website/docs`)
- `-o, --outline <filename>` - name of the outline file intended for Skelo CLI (default: `website/products.outline.yaml`)
- `-v, --verbose` - verbose output
- `--schema <filename>` - name of `.json` file with product list definition schema (default: `schema.json`)

If no patterns appear, the default pattern is used: `**/*.[Pp]roducts.json`. If no files match this pattern, then the alternative pattern is used: `__products__/**/*.json`

##### Examples

```bash
prodpage-cli
```

- look for product files in current folder and matching the `**/*.[Pp]roducts.json` pattern. If no files match this pattern, look for files matching the `__products__/**/*.json` (i.e. look for all files ending with `.json` starting with the `__products__` subfolder).
- `-d` value: `website/docs`
- `-o` value: `website/products.outline.yaml`

`website/products.outline.yaml` file:

```yaml
sidebars:
  - label: "product-one-sidebar"
    items:
      - label: "Product One documentation"
        title: "Welcome to Product One documentation"
        slug: "product-one-documentation"
        brief: "Develop documentation with additional topics and categories in the `products.outline.yaml` in the `product-one-sidebar` sidebar definition"
```

```bash
prodpage-cli myproducts.products.json -v
```

- look for `myproducts.products.json` product list file in current folder.
- `-d` value: `website/docs`
- `-o` value: `website/products.outline.yaml`

#### `check` command

Validates product list files against the product list validation schema.

##### Usage

```bash
prodpage-cli check [patterns...] [options]
```

#### `init` command

Creates a configuration file. It may accept a configuration filename to create, the default being the program.name and .json. Has the `--yes (-y)` to accept the default values from `./config/default.json`.

##### Usage

```bash
prodpage init [filename] [options]
```

##### Arguments

- `[filename]` - optional name of the configuration file (default: `prodpage.json`)

##### Options

- `-y, --yes` - accept default values from `./config/default.json`

##### Examples

```bash
prodpage init
# Creates prodpage.json with an empty JSON object
```

```bash
prodpage init myconfig.json
# Creates myconfig.json with an empty JSON object
```

```bash
prodpage init -y
# Creates prodpage.json with default values from config/default.json
```

```bash
prodpage init myconfig.json -y
# Creates myconfig.json with default values from config/default.json
```

#### `help` command

Provides help text for a command.

##### Usage

```bash
prodpage-cli help [command]
```

## Configuration

The CLI can be configured using a JSON file. By default, the CLI looks for a file named after the program (e.g., `prodpage.json`) in the current working directory. You can specify a custom configuration file using the `-c, --config <path>` global option.

To initialize a configuration file, use the `init` command. This command can create an empty configuration file or populate it with default values from `config/default.json`.

## Product List Schema

Product definitions appear in product list files. Product list files are `.json` file containing an array of product definition items. To ensure product list files meet design specifications, a `schema.json` file contains the validation schema.

A product definition item is either a string or an object. The following product list contains two product definition items:

```json
[
  "   Product One   ",
  {
    "label": "   Product Two   "
  }
]
```

- A string product item may have heading or trailing spaces, and contain letters, digits, and spaces. Only a space is allowed between sequences of letters or digits.
- The object must have the `label` property, whose value is a string. The string for `label` must adhere to the same rules as the string item.
- Additional object properties include:
  - `productId` - product slug string
  - `path` - path of folders preceding product documentation folder

The product list file schema is found in `schema.json` in the application root folder.

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
          "path": {
            "type": "string",
            "pattern": "^([a-z]+([-]?[a-z0-9]+)*\\/)*[a-z]+([-]?[a-z0-9]+)*$"
          },
          "description": {
            "type": "string"
          }
        },
        "required": ["label"],
        "additionalProperties": true
      }
    ]
  }
}
```

| Property    | Description                                          | Default               | Example                              |
| :---------- | :--------------------------------------------------- | :-------------------- | :----------------------------------- |
| `label`     | Human readable product label identifying the product |                       | `"Product One"`                      |
| `productId` | product slug string                                  | slug of `label` value | `product-one`                        |
| `path`      |                                                      | ""                    | `"path/to/parent/to/product/folder"` |

### Product list file examples

1. Defines two products, "Product One" and "Product Two" using strings.

    ```json
    ["Product One", "Product Two"]
    ```

    The equivalent of object definition:

    ```json
    [
      {
        "label": "Product One",
        "productId": "product-one"
      },
      {
        "label": "Product Two",
        "productId": "product-two"
      }
    ]
    ```

2. Defines three product, two in string format and the third in object format:

    ```json
    [
      "Product One",
      {
        "label": "Product Three"
      },
      "Product Two"
    ]
    ```

    The equivalent of object definition:

    ```json
    [
      {
        "label": "Product One",
        "productId": "product-one"
      },
      {
        "label": "Product Three",
        "productId": "product-three"
      },
      {
        "label": "Product Two",
        "productId": "product-two"
      }
    ]
    ```

3. Defines four products, two in string format the third and fourth in object format. The fourth product has a specified `productId` value

    ```json
    [
      "Product One",
      {
        "label": "Product Three"
      },
      "Product Two",
      {
        "label": "Product Four",
        "productId": "pr-4"
      }
    ]
    ```

    The equivalent of object definition:

    ```json
    [
      {
        "label": "Product One",
        "productId": "product-one"
      },
      {
        "label": "Product Three",
        "productId": "product-three"
      },
      {
        "label": "Product Two",
        "productId": "product-two"
      },
      {
        "label": "Product Four",
        "productId": "pr-4"
      }
    ]
    ```

## Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
