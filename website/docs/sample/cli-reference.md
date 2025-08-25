# CLI Reference

This section provides a detailed reference for the DocGen command-line interface.

## `build`

Builds the documentation folders and files.

```bash
docgen build [patterns...]
```

### Arguments

- `patterns...`: One or more glob patterns for the product list files.

### Options

- `-t, --templates <path>`: Path to the templates folder. Default: `templates`.
- `-o, --outline <filename>`: Outline file. Default: `website/products.outline.yaml`.
- `-d, --docs <path>`: Documentation folder. Default: `website/docs`.
- `--schema <filename>`: Schema file. Default: `schema.json`.
- `-v, --verbose`: Verbose output.

## `check`

Checks the validity of the product list files against the schema.

```bash
docgen check [patterns...]
```

### Arguments

- `patterns...`: One or more glob patterns for the product list files.

### Options

- `--schema <filename>`: Schema file. Default: `schema.json`.
- `-v, --verbose`: Verbose output.
