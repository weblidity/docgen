---
keywords: ["templating", "handlebars", "hbs"]
---

# Templating

DocGen uses Handlebars for templating. You can customize the output by creating your own templates.

The following templates are used:

*   `documentation-index.hbs`: The main index file for all products.
*   `product-index.hbs`: The index file for a single product.
*   `partial-path-index.hbs`: The index file for a folder in the documentation path.
*   `outline-file.hbs`: The template for the outline file.

To use your own templates, use the `--templates` option with the `build` command:

# Templating

DocGen uses Handlebars for templating. You can customize the output by creating your own templates.

The following templates are used:

*   `documentation-index.hbs`: The main index file for all products.
*   `product-index.hbs`: The index file for a single product.
*   `partial-path-index.hbs`: The index file for a folder in the documentation path.
*   `outline-file.hbs`: The template for the outline file.

To use your own templates, use the `--templates` option with the `build` command:

```bash
docgen build --templates /path/to/your/templates
```

