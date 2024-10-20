const { Command } = require("commander");
const fs = require("fs");
const Validator = require('jsonschema').Validator;
const hbsr = require("hbsr");
const { saveDocument } = require("file-easy")



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
    .command('build', {
        isDefault: true
    })
    .alias('b')
    .description('build products list')
    .argument('[patterns...]', 'products list file')
    .option('-v, --verbose', 'verbose output')
    .option('-t, --templates <path>', 'templates folder', path.join(__dirname, "..", "templates"))
    .option('-o, --outline <filename>', 'outline file', 'website/products.outline.yaml')
    .option('-d, --docs <path>', 'documentation folder', 'website/docs')
    .option('--schema <filename>', 'schema file', 'schema.json')
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

        console.log('productsList', JSON.stringify(productsList, null, 2));

        // Create productId if not specified and build an object
        //  when product definition is string

        productsList = productsList.map((product) => {
            product = (typeof product === "string") ? {"label": product} : product;
            product.label = product.label.trim();
            if (!product.productId) {
                product.productId = product.label.trim().replace(/ /g, "-").toLowerCase();
            }
            return product;
        })

        console.log('productsList', JSON.stringify(productsList, null, 2));

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
                    pathParts[i] = pathParts[i].trim();
                }
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

program.parse("node ./bin/cli.js -v".split(" "));
// program.parse();

function getFiles(patterns, options) {
    let filenames = [];
    if (patterns.length > 0) {
        filenames = globSync(patterns);
    } else {
        filenames = globSync(config.patterns[0]);
        if (filenames.length === 0) {
            filenames = globSync(config.patterns[1]);
        }
    }
    return filenames;
}