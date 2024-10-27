---
sidebar_label: Getting started
---

# Getting started


## Installation

Install the `docs-docgen-cli` globally with `npm` to run `docgen` CLI anywhere on your computer.

```bash
npm i -g docs-docgen-cli
```

The `docgen` program is now available anywhere on your computer. Check it's available by executing:

```bash
docgen -V
# 1.0.3
```

## Usage

1. Create `company.products.json` products list file with a list of product details.

2. Invoke `docgen CLI` with the products list file.

   ```bash
   npx docs-docgen-cli company.products.json
   ```

3. Notice the generated files: 
   1. `website/docs/index.md`
   2. `website/docs/<product-slug>/index.md`
   3. `website/products.outline.yaml`

4. Invoke `skelo CLI` with the `products.outline.yaml`

    ```bash
    npx skelo ./website/products.outline.yaml -d ./website/docs -s ./website/sidebars.js
    ```
5. The Docusaurus local development server will show the documentation structure. Include the following in the `docusaurus.config.js` file:

    ```js
    // scroll down to the themeConfig
    // under the navbar property, find the items property
    /// ...
    items: [
        {
            "to": "/docs/index",
            "label": "Documentation"
        },
        //...
    ]
    ```

## Product list file

You list the company products in a products list file - a .json file that contains an array whose items are eithe a non-empty string or an object. The object needs a label property whose value is a non-empty string. Common additional object properties include productId, description, and path.

Products list file example:

```json
[
    "Product Name as String",
    {
        "label": "Product Name as Object",
        "description": "The label property is a non-empty string"
    },
    {
        "label": "Product Three",
        "productId": "p3",
        "description": "This product uses the p3 folder. The default value for productId property is the slug based on label value."
    },
    {
        "label": "Product Four",
        "path": "additional/folders/before/product-folder",
        "description": "The product documentation is at additional/folders/before/product-folder/product-four"
    }
]
```