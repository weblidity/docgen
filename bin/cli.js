#!/usr/bin/env node

const { Command } = require("commander");
const { saveDocument } = require("file-easy")
const fs = require("fs");
const hbsr = require("hbsr");
const Validator = require('jsonschema').Validator;

const program = new Command();
let { name, version, description } = require("../package.json");
const { globSync } = require("glob");
const path = require("path");

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
    .command('build', { isDefault: true})
    .alias('b')
    .description('build products list')
    .argument('[patterns...]', 'products list file')
    .option('-v, --verbose', 'verbose output')
    .option('-t, --templates <path>', 'templates folder', path.join(__dirname, "..", "templates"))
    .option('-o, --outline <filename>', 'outline file', 'website/products.outline.yaml')
    .option('-d, --docs <path>', 'documentation folder', 'website/docs')
    .option('--schema <filename>', 'schema file', path.join(__dirname, "..",   'schema.json'))
    .action((patterns, options) => {

        let filenames = getFiles(patterns, options);
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
            product = (typeof product === "string") ? {"label": product} : product;
            product.label = product.label.trim();
            if (!product.productId) {
                // product.productId = product.label.trim().replace(/ /g, "-").toLowerCase();
                product.productId = slugify(product.label);
            }
            return product;
        })

        // Create documentation index
        let documentationIndex = path.join(options.docs, 'index.md');
        let documentationIndexContent = hbsr.render_template('documentation-index', {products: productsList});
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
                    let partialPath = pathParts.slice(0, i+1).join("/");

                    let partialPathIndex = path.join(options.docs, `${partialPath}`, 'index.md');
                    let partialPathIndexContent =
                    hbsr.render_template('partial-path-index', {product: product});
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
            let productIndexContent = hbsr.render_template('product-index', {product: product});
            saveDocument(productIndex, productIndexContent)
            if (options.verbose) {
                console.log(`Created ${productIndex}`);
            }
        })

        // Create .outline.yaml file
        let outline = path.join(options.outline);
        let outlineContent = hbsr.render_template('outline-file', {products: productsList});
        saveDocument(outline, outlineContent)
        if (options.verbose) {
            console.log(`Created ${outline}`);
        }

    })

program
    .command('check')
    .description('check product list')
    .argument('[patterns...]', 'products list file')
    .option('-v, --verbose', 'verbose output')
    .option('--schema <filename>', 'schema file', 'schema.json')

    .action((patterns, options) => {

        let filenames = getFiles(patterns, options);
        if (filenames.length === 0) {
            console.log("no files found");
            return true;
        }

        try {
            let productsListSchema = JSON.parse(fs.readFileSync(options.schema  || path.join(__dirname, "..", "schema.json"), 'utf8'));

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

/**
 * Given an array of patterns, returns an array of filenames matching the patterns.
 * If no patterns are given, the function uses the default patterns defined in the
 * module.
 *
 * @param {Array<string>} patterns - Array of glob patterns to search for.
 * @param {Object} options - Options to globSync.
 * @throws {Error} If the patterns array is not an array.
 * @returns {Array<string>} Array of filenames.
 */
function getFiles(patterns, options) {
    try {
        if (!patterns || !Array.isArray(patterns)) {
            throw new Error("Patterns must be an array");
        }

        const filenames = patterns.length > 0
            ? globSync(patterns)
            : globSync(config.patterns[0], { cwd: process.cwd() }).concat(
                globSync(config.patterns[1], { cwd: process.cwd() })
            );

        return filenames;
    } catch (error) {
        console.error("Error getting files:", error.message);
        return [];
    }
}

/**
 * Slugify a string.
 *
 * @param {string|null|undefined} input The string to slugify.
 * @throws {Error} If the input is not a string.
 * @throws {Error} If the input is null or undefined.
 * @returns {string} The slugified string.
 */
function slugify(input) {
    if (input === null || input === undefined) {
        throw new Error("Input to slugify cannot be null or undefined");
    }
    if (typeof input !== "string") {
        throw new Error("Input to slugify must be a string");
    }

    return input
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
