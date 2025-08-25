# Quick demo

## Step 1. Check `docgen` is available

Execute `docs-docgen-cli` package without downloading it locally. Use -V option to get package version.

```bash
npx docs-docgen-cli -V
```

## Step 2. Local Docusaurus project

1. Create your working folder and `cd` into it.

```bash
mkdir my-folder
cd my-folder
```
2. Create Docusaurus project


```bash
npx create-docusaurus@latest website classic
```

:::note
* Choose JavaScript during Docusaurus installation.
* Make sure you `cd website` and `npm run start` - as per `create-docusaurus` instructions.
:::

## Step 3. Create products list files

In your working folder, i.e. `my-folder`, create `demo.products.json` file.

```json
[
    {
        "label": "Product One"
    },
    {
        "label": "Product Two"
    }
]
```

It contains definitions for "Product One" and "Product Two".

## Step 4: Launch `docs-docgen-cli`

In your work folder, i.e. `my-folder`:

```bash
npx docs-docgen-cli demo.products.json -v
```

```txt
Created website\docs\index.md
Created website\docs\product-one\index.md
Created website\docs\product-two\index.md
Created website\products.outline.yaml
```

It generates the following:

* `website/docs/index.md` - the page contains a product directory. Product labels are ordered alphabetically, and each entry links to the product folder (e.g. `docs/<productId>`).
* `website/docs/<productId>/index.md` - the product summary page in product folder.
* `website/products.outline.yaml`

The generated `website/products.outline.yaml` file contains a sidebar content which `skelo CLI` will use in the next step.

```yaml
sidebars:

    - label: "product-one-sidebar"
      path: "product-one"
      items:

          - label: "Product One"
            href: "docs/product-one"

          - label: "Overview"
            title: "Welcome to Product One description"
            slug: "overview"
            brief: "Default Product One description. Replace it with specific description"


    - label: "product-two-sidebar"
      path: "product-two"
      items:

          - label: "Product Two"
            href: "docs/product-two"

          - label: "Overview"
            title: "Welcome to Product Two description"
            slug: "overview"
            brief: "Default Product One description. Replace it with specific description"
```

| Product | Folder | Product top documentation file |
|:--|:--|:--|
| `Product One` | `product-one` | `product-one/overview.md` |
| `Product Two` | `product-two` | `product-two/overview.md` |

## Step 5: Generate `sidebars.js` and documentation files

Invoke skelo CLI with `products.outline.yaml`. 

```bash
npx skelo website/products.outline.yaml -d website/docs -s website/sidebars.js -v
```

Go to `localhost:3000/docs`



