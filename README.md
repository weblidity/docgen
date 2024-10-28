<p align="center">
  <a href="">
 <img width=200px height=200px src="https://i.imgur.com/0Axr7in.jpg" alt="Docs DocGen CLI Project Logo"></a>
</p>


<h1 align="center">Docs DocGen CLI</h1>
<h2 align="center">Code name: <code>DocGen</code></h2>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]() ![NPM Version](https://img.shields.io/npm/v/docs-docgen-cli)
 [![GitHub Issues](https://img.shields.io/github/issues/weblidity/docgen.svg)](https://github.com/weblidity/docgen/issues) [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/weblidity/docgen.svg)](https://github.com/weblidity/docgen/pulls) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

CLI tool generating documentation files and folders for multiple projects on a Docusaurus-powered site.

## Installation

Install the package locally using the global switch.

```bash
npm install docs-docgen-cli -g
```

After installing it locally, you can use from any folder on your computer. Check `docs-docgen-cli` is available:

```bash
docs-docgen-cli -V
# output
# 1.0.3
```

Alternativelly, run `docs-docgen-cli` without installing it locally (recommended).

```bash
npx docs-docgen-cli -V
```

## Commands

- `build` - build files and folders for company product documentation structure for a Docusaurus-powered site.
- `check` - check valid structure of product list files.
- `help` - provide help text for a command.

## Options

- `-h, --help` - provide application help.
- `-V, --version` -- provide current application version.

## `build` command

This is the default command, i.e. this is the command executed when no command appears on the command line.

1. **Retrieves product list** files using patterns in the arguments or default patterns.
2. **Collect product definitions** from each product list file.
3. For each product defined, generate a **product folder** under `docs` and **an `index.md` file** inside each product folder.
4. **In the `docs` folder, generate `index.md`** containing a list of products and links to product index page.
5. **Generate an `.outline.yaml`** that you will use with `Skelo CLI` to complete the documentation start-up.

### Usage

```bash
docs-docgen-cli [build] [patterns...] [options]
```

### Arguments

- `[patterns...]` - optional list of product list filename patterns

### Options

- `-d, --docs <path>` - path to Docusaurus docs folder. (default: `website/docs`)
- `-o, --outline <filename>` - name of the outline file intended for Skelo CLI (default: `website/products.outline.yaml`)
- `-v, --verbose` - verbose output
- `--schema <filename>` - name of `.json` file with product list definition schema (default: `schema.json`)

If no patterns appear, the default pattern is used: `**/*.[Pp]roducts.json`. If no files match this pattern, then the alternative pattern is used: `__products__/**/*.json`

### Examples

```bash
docs-docgen-cli
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
docs-docgen-cli myproducts.products.json -v
```

- look for `myproducts.products.json` product list file in current folder.
- `-d` value: `website/docs`
- `-o` value: `website/products.outline.yaml`

### Product list schema

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
                "required": [
                    "label"
                ],
                "additionalProperties": true
            }
        ]
    }
}
```

Property | Description | Default | Example |
:--|:--|:--|:--|
`label` | Human readable product label identifying the product |  | `"Product One"` |
`productId` | product slug string | slug of `label` value | `product-one` |
`path` | | "" | `"path/to/parent/to/product/folder"` |

### Product list file examples

1. Defines two products, "Product One" and "Product Two" using strings.

    ```json
    [
        "Product One",
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

## `check` command

Validates product list files against the product list validation schema.

### Usage

```bash
docs-docgen-cli check [patterns...] [options]
```

### Arguments

- `[patterns...]` - optional list of product list filename patterns

### Options

- `-v, --verbose` - verbose output
- `--schema <filename>` - path to validation schema file (default: `schema.json`)

## Quick demo

For a quick demo of how to use `docgen CLI`, visit [Quick demo](https://weblidity.github.io/docgen/docs/quick-demo)