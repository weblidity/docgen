#!/usr/bin/env node

const { Command }             = require("commander");
const { saveDocument }        = require("file-easy")
const fs                      = require("fs");
const hbsr                    = require("hbsr");
const { findMatchingFiles, slugify }   = require("../lib/utils");
const Validator               = require('jsonschema').Validator;

let { name, version, description }  = require("../package.json");
const { globSync }                  = require("glob");
const path                          = require("path");

const program                       = new Command();

const config = {
    "patterns": [
        ["**/*.[Pp]roducts.json"],
        ["__products__/**/*.json"]
    ]
}

program
    .name(name)
    .version(version)
    .description(description);

program
    .command('build', { isDefault: true })
    .alias('b')
    .description('build documentation folders and files for multiple company products')
    .argument('[patterns...]', 'pattern for products list file')
    .option('-v, --verbose', 'verbose output')
    .option('-t, --templates <path>', 'templates folder', path.join(__dirname, "..", "templates"))
    .option('-o, --outline <filename>', 'outline file', 'website/products.outline.yaml')
    .option('-d, --docs <path>', 'documentation folder', 'website/docs')
    .option('--schema <filename>', 'schema file', path.join(__dirname, "..", 'schema.json'))
    .action((patterns, options) => {

        let filenames = findMatchingFiles(patterns, config.patterns, options);
        let productsList = [];
        filenames.forEach((filename) => {
            let productsDefined = JSON.parse(fs.readFileSync(filename, 'utf8'));
            productsDefined.forEach((product) => {
                if (productsList.indexOf(product) !== -1) {
                    throw new Error(`Duplicate product: ${product}`);
                }
                productsList.push(product);
            })
        })

        // Create productId if not specified and build an object
        //  when product definition is string

        productsList = productsList.map((product) => {
            product = (typeof product === "string") ? { "label": product } : product;
            product.label = product.label.trim();
            if (!product.productId) {
                // product.productId = product.label.trim().replace(/ /g, "-").toLowerCase();
                product.productId = slugify(product.label);
            }
            return product;
        })

        // Create documentation index
        let documentationIndex = path.join(options.docs, 'index.md');
        let documentationIndexContent = hbsr.render_template('documentation-index', { products: productsList });
        saveDocument(documentationIndex, documentationIndexContent)
        if (options.verbose) {
            console.log(`Created ${documentationIndex}`);
        }

        // Create product index page
        productsList.forEach((product) => {

            /**
             * Create index.md in each folder of the path
             */
            if (product.path) {
                let pathParts = product.path.split("/");
                for (let i = 0; i < pathParts.length; i++) {
                    let partialPath = pathParts.slice(0, i + 1).join("/");

                    let partialPathIndex = path.join(options.docs, `${partialPath}`, 'index.md');
                    let partialPathIndexContent =
                        hbsr.render_template('partial-path-index', { product: product });
                    saveDocument(partialPathIndex, partialPathIndexContent)
                    if (options.verbose) {
                        console.log(`Created ${partialPathIndex}`);
                    }
                }
            }

            /**
             * Create index.md in product folder
             */
            let productIndex = (product.path) ? path.join(options.docs, `${product.path}`, `${product.productId}`, 'index.md') : path.join(options.docs, `${product.productId}`, 'index.md');
            let productIndexContent = hbsr.render_template('product-index', { product: product });
            saveDocument(productIndex, productIndexContent)
            if (options.verbose) {
                console.log(`Created ${productIndex}`);
            }
        })

        // Create .outline.yaml file

        let outline = path.join(options.outline);

        // Make sure the outline file ends with .outline.yaml
        // If not, add the extension
        if (!outline.endsWith(".outline.yaml") && !outline.endsWith(".outline") && !outline.endsWith(".yaml")) {
            // No extension at all, add .outline.yaml
            outline += ".outline.yaml";
        } else if (outline.endsWith(".outline")) {
            // Only .outline, add .yaml
            outline += ".yaml";
        }

        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        let outlineContent = hbsr.render_template('outline-file', { products: productsList, datetime: datetime, appname: name });
        saveDocument(outline, outlineContent)
        if (options.verbose) {
            console.log(`Created ${outline}`);
        }

    })

program
    .command('check')
    .description('check valid structure of product list files')
    .argument('[patterns...]', 'pattern for products list file')
    .option('-v, --verbose', 'verbose output')
    .option('--schema <filename>', 'schema file', 'schema.json')

    .action((patterns, options) => {

        console.log("patterns", patterns)
        let filenames = findMatchingFiles(patterns, config.patterns, options);
        if (filenames.length === 0) {
            console.log("no files found");
            return true;
        }

        try {
            let productsListSchema = JSON.parse(fs.readFileSync(options.schema || path.join(__dirname, "..", "schema.json"), 'utf8'));

            if (options.verbose) {
                console.log(filenames);
            }

            let validator = new Validator();
            let valid = filenames.sort().every((filename) => {

                let productsDefined = JSON.parse(fs.readFileSync(filename, 'utf8'));

                let productsList = validator.validate(productsDefined, productsListSchema);
                if (options.verbose) {
                    console.log(`Checking ${filename} format: ${(productsList.valid) ? "valid" : "invalid"}`);
                }
                return productsList.valid;
            })

            console.log(`${(valid) ? "Valid" : "Invalid"} products list`);

        } catch (error) {
            console.log(error);
        }
    })

// TODO: Remove the program.parse with a split string as argument when done
// program.parse("node ./bin/cli.js -v".split(" "));

program.parse();
