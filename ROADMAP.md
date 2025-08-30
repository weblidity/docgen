# Roadmap

## Files to generate, related options

- **productIndex:** currently the filename is hardcoded as `products.md`.
  - **Create option for product page filename** so configuration or the option can specify `index.md`

## Create product's related link

- Loading the docusaurus.config.js to update `themeConfig.navbar.items` with `Product documentation` item and subitems to featured products and link to products index page. For example:

```typescript
themeConfig = {
  navbar: {
    // ... other navbar properties ...
    items: [
      // ... other items ...
      {
        label: "Product documentation",
        position: "left",
        items: [
          {
            label: "Product One",
            to: "/docs/product-one/overview",
          },
          {
            label: "Product Two",
            to: "/docs/product-two/overview",
          },
          {
            label: "View all products",
            to: "/docs/products",
          },
        ],
      },
    ],
  },
};
```

## Prepare validation for products.json and configuration file

Make sure the files follow a schema that validates each file. While still building the app, the schema can be changed.
