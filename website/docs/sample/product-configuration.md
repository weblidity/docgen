# Product Configuration

The product files are JSON files that contain an array of product definitions. By default, DocGen looks for files ending with `.products.json`.

Each product definition is an object with the following properties:

- `label` (string, required): The name of the product.
- `productId` (string, optional): A unique identifier for the product. If not provided, it will be generated from the label.
- `description` (string, optional): A short description of the product.
- `path` (string, optional): The path to the product's documentation folder.

## Example

```json
[
  {
    "label": "Product A",
    "path": "group1"
  },
  {
    "label": "Product B",
    "path": "group1"
  },
  {
    "label": "Product C",
    "path": "group2"
  }
]
```
