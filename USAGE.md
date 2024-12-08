```bash

Usage: docs-docgen-cli [options] [command]

CLI tool to generate a start-up set of files and folders for company products
documentation hosted on a Docusaurus-powered site.

Options:
  -V, --version                    output the version number
  -h, --help                       display help for command

Commands:
  build|b [options] [patterns...]  build documentation folders and files for
                                   multiple company products
  check [options] [patterns...]    check valid structure of product list files
  help [command]                   display help for command
```

**`build` command:**

```bash
Usage: docs-docgen-cli build|b [options] [patterns...]

build documentation folders and files for multiple company products

Arguments:
  patterns                  pattern for products list file

Options:
  -v, --verbose             verbose output
  -t, --templates <path>    templates folder (default:
                            "C:\\Users\\ig343\\OneDrive\\Documents\\VS Code
                            Development\\docgen\\templates")
  -o, --outline <filename>  outline file (default:
                            "website/products.outline.yaml")
  -d, --docs <path>         documentation folder (default: "website/docs")
  --schema <filename>       schema file (default:
                            "C:\\Users\\ig343\\OneDrive\\Documents\\VS Code
                            Development\\docgen\\schema.json")
  -h, --help                display help for command
```

**`check` command:**

```bash
Usage: docs-docgen-cli check [options] [patterns...]

check valid structure of product list files

Arguments:
  patterns             pattern for products list file

Options:
  -v, --verbose        verbose output
  --schema <filename>  schema file (default: "schema.json")
  -h, --help           display help for command
```

**`help` command:**

```bash
Usage: docs-docgen-cli [options] [command]

CLI tool to generate a start-up set of files and folders for company products
documentation hosted on a Docusaurus-powered site.

Options:
  -V, --version                    output the version number
  -h, --help                       display help for command

Commands:
  build|b [options] [patterns...]  build documentation folders and files for
                                   multiple company products
  check [options] [patterns...]    check valid structure of product list files
  help [command]                   display help for command
```
