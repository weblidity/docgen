# Quick demo

## Step 1. Check `docgen` is available:

```bash
docgen -V
```

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
* Make sure you cd into website folder and perform the npm run start -- as Docusaurus site instructs.
:::

## Step 3. Create products list files

In your working folder, i.e. `my-folder`, create `demo.products.json` file.

```json
{
    {
        "label": "Product One"
    },
    {
        "label": "Product Two"
    }
}
```

It contains definitions for "Product One" and "Product Two".

## Step 4: Launch `docs-docgen-cli`

In your work folder, i.e. `my-folder`:

```bash
npx docs-docgen-cli demo.products.json -d ./website/docs -o ./website/products.outline.yaml -v
```

It generates the following:

* `website/docs/index.md` - the page contains a product directory. Product labels are ordered alphabetically, and each entry links to the product folder (e.g. `docs/<productId>`).
* `website/docs/<productId>/index.md` - the product summary page in product folder.
* `website/products.outline.yaml`

The generated `website/products.outline.yaml` contains a sidebar content which `skelo CLI` will use in the next step.

```yaml
sidebars:

    - label: "product-one-sidebar"
      path: "product-one"
      items:

          - label: "Product One"
            href: "docs/product-one"
          
          - label: "Overview"
            title: "Welcome to Product One description"
            slug: "product-one-overview"
            brief: "Default Product One description. Replace it with specific description"
```

| Product | Folder | Product top documentation file |
|:--|:--|:--
| `Product One` | `product-one` | `product-one-documentation` |
| `Product Two` | `product-two` | `product-two/product-two-documentation` |

