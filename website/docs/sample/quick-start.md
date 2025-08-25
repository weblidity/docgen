# Quick Start

This guide will walk you through the basics of using DocGen to create your first documentation.

## 1. Create a Product File {#my-products.products}

Create a JSON file named `my-products.products.json` with the following content:

```json
[
  {
    "label": "My First Product",
    "description": "This is a description of my first product."
  },
  {
    "label": "My Second Product",
    "description": "This is a description of my second product."
  }
]
```

## 2. Run the Build Command

Now, run the `build` command to generate the documentation:

```bash
docgen build "**/*.products.json"
```

This will generate the documentation in the `website/docs` directory by default.

## 3. View the Output

You will find the generated documentation in the `website/docs` folder. You can now view the `index.md` and the individual product pages.
