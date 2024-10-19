const { Command } = require("commander");
const fs = require("fs");
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
    .command('build', {
        isDefault: true
    })
    .alias('b')
    .description('build products list')
    .argument('[patterns...]', 'products list file')
    .option('-v, --verbose', 'verbose output')
    .option('-t, --templates <path>', 'templates folder', path.join(__dirname, "..", "templates"))
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