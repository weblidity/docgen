---
sidebar_label: "Introduction"
---

# Welcome to DocGen documentation

## Quick demo

### Step 1: Create Docusaurus project in working folder

1. Create a working folder

```bash
mkdir my-project
cd my-project
```

2. Create Docusaurus project

Visit Docusarus documentation and follow the quick start.

```bash
npx create-docusarus@latest website classic
```

:::info

- When prompted, choose JavaScript
- Follow the prompt to cd to `website` and `npm run start`
  :::

### Step 2: Create products list file

1. In `my-project`, create `demo.products.json`

```json
["DocGen", "Skelo"]
```

This will create documentation for two products, each in its own folder.

2. Check products list file is valid

```bash
# use the -v switch for a verbose output
npx docgen check demo.product.json -v
```

### Step 3: Generate product-related files and folders

```bash
# use the -v switch for a verbose output
npx docgen demo.products.json -v
```

DocGen generates the following files:

- `website/docs/index.md`
- `website/docs/docgen/index.md`
- `website/docs/skelo/index.md`
- `website/products.outline.yaml`

### Step 4: Edit documentation site navigation bar

Edit `docusaurus.config.js` in the `website` folder:

```js
// ... look the items property in the themeConfig
items: [
  { to: "/docs", label: "Documentation" },
  // ...
];
```
