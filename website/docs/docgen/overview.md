---
sidebar_label: Overview
slug: overview
---

# Welcome DocGen documentation

A quick understanding of DocGen

## Introduction

Why do it, what does it do?

## How to use DocGen

- describe products in product files. A product file defines at least one product. A product description is either a string or an object with at least the label property.
- other product properties include: productId, description, path, slug.

- uses a validation schema.
- it uses templates
- it uses a configuration file

## What it generates

- a product folder and an index page inside the product folder.
- an documentation index.md file in the `docs` folder - contains a product directory, with product label ordered alphabetically. The product entry links to product folder.
- a `products.outline.yaml` file - you will use this file in when you invoke the `skelo CLI` to generate the documentation files.

## Overall process description

1. Your company develops several products and you have a list of products labels.
2. You will store the each product documentation in a product folder. "Product One" documentation and landing page are stored in `docs/product-one` folder.
3. The product folder has an index page that you can use a product landing page. The product landing page for "Product One" is at: `docs/product-one/index.md`. The product's landing page URL is `https://<company-url>/docs/product-one`. It contains a link to product's first page of documentation.
4. The Product One documentation first page appears as "Overview" in the sidebar, and is in the `docs/page-one/overview.md` file.
5. The `docs/index.md` page contains a product directory, with products ordered alphabetically and linking to the product index page.

This structure allows visitors to view a list of products, to view the product page, and connect to the product documentation.

The product generates the summary page and product index page for each product. It also generates an `.outline.yaml` file that you use use with `skelo CLI` to generate the product top documentation page.

After generating the folders and index.md pages, you have to generate the sidebars for each product and the `sidebars.js` file that tells Docusaurus the structure for each product documentation. While you can do this manually, a much easier method is to use the `products.outline.yaml` with skelo CLI.
