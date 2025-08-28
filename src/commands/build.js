const { mergeOptions } = require("../cli/utils"); // Import mergeOptions
const glob = require("glob"); // Import glob
const fs = require("fs"); // Import fs
const path = require("path"); // Import path
const Handlebars = require("handlebars"); // Import hbsr

module.exports = (program) => {
  program
    .command("build")
    .alias("b")
    .description("Builds the project")
    .argument(
      "[patterns...]",
      "optional list of product list filename patterns",
    )
    .option("-o, --output <directory>", "specify output directory", "dist")
    .option("-w, --watch", "watch files for changes and rebuild automatically")
    .option(
      "-i, --ignore <patterns...>",
      "patterns of files to ignore when matching files to retrieve",
      [],
    )
    .option(
      "-d, --docs <path>",
      "path to where the products index page will go",
      "website/docs",
    )
    .option(
      "-s, --sidebars <file>",
      "path and name of the sidebars file in .js where build will add the entry to products index page",
      "website/sidebars.js",
    )
    .option(
      "-t, --templates <path>",
      "folder where template files are stored",
      "templates",
    ) // New option
    .action((patterns, options) => {
      const mergedOptions = mergeOptions(program, "build", options);

      const effectivePatterns =
        patterns.length > 0
          ? patterns
          : program.config.build && program.config.build.patterns
            ? program.config.build.patterns
            : [];
      const ignore = mergedOptions.ignore;

      const docsPath = mergedOptions.docs;
      const sidebarsFile = mergedOptions.sidebars;
      const templatesPath = mergedOptions.templates; // Get templates path

      const outputDir = mergedOptions.output;
      const watchMode = mergedOptions.watch;

      console.log(`Building project...`);
      console.log(`Patterns: ${effectivePatterns.join(", ")}`);
      console.log(`Ignore: ${ignore.join(", ")}`);
      console.log(`Docs Path: ${docsPath}`);
      console.log(`Sidebars File: ${sidebarsFile}`);
      console.log(`Templates Path: ${templatesPath}`); // Log templates path

      const matchedFiles = glob.sync(effectivePatterns, {
        ignore: ignore,
        absolute: true,
      });
      console.log(`Matched Files: ${matchedFiles.join(", ")}`);

      let allProducts = [];
      matchedFiles.forEach((file) => {
        try {
          const fileContent = fs.readFileSync(file, "utf8");
          const products = JSON.parse(fileContent);
          allProducts = allProducts.concat(products);
        } catch (e) {
          console.error(`Error reading or parsing file ${file}: ${e.message}`);
        }
      });

      console.log("Collected Products:", JSON.stringify(allProducts, null, 2));

      // Ensure docs directory exists
      if (!fs.existsSync(docsPath)) {
        fs.mkdirSync(docsPath, { recursive: true });
      }

      // Generate Docusaurus Markdown for product index
      const productIndexTemplateFile = path.join(
        templatesPath,
        mergedOptions.templateFiles.productIndex,
      );
      if (fs.existsSync(productIndexTemplateFile)) {
        const templateContent = fs.readFileSync(
          productIndexTemplateFile,
          "utf8",
        );
        const template = Handlebars.compile(templateContent);
        const markdownContent = template({ products: allProducts });
        const productsMarkdownPath = path.join(docsPath, "products.md");
        fs.writeFileSync(productsMarkdownPath, markdownContent, "utf8");
        console.log(
          `Generated Docusaurus product list at: ${productsMarkdownPath} using template.`,
        );
      } else {
        console.warn(
          `Template file not found at: ${productIndexTemplateFile}. Falling back to default Markdown generation for product index.`,
        );
        let markdownContent = "# All Products\n\n";
        if (allProducts.length > 0) {
          markdownContent += "Here is a list of all collected products:\n\n";
          allProducts.forEach((product) => {
            const label = product.label || product; // Handle string or object product
            const productId =
              product.productId ||
              (typeof product === "string"
                ? product.toLowerCase().replace(/\s/g, "-")
                : "");
            markdownContent += `- [${label}](/docs/${productId})\n`; // Assuming product pages will be at /docs/product-id
          });
        } else {
          markdownContent += "No products found.\n";
        }
        const productsMarkdownPath = path.join(docsPath, "products.md");
        fs.writeFileSync(productsMarkdownPath, markdownContent, "utf8");
        console.log(
          `Generated Docusaurus product list at: ${productsMarkdownPath} (default Markdown).`,
        );
      }

      // Generate individual product pages
      const productTemplateFile = path.join(
        templatesPath,
        mergedOptions.templateFiles.product,
      );
      if (fs.existsSync(productTemplateFile)) {
        const templateContent = fs.readFileSync(productTemplateFile, "utf8");
        const template = Handlebars.compile(templateContent);

        allProducts.forEach((product) => {
          const productId =
            product.productId ||
            (typeof product === "string"
              ? product.toLowerCase().replace(/\s/g, "-")
              : "");
          if (!productId) {
            console.warn("Skipping product without a productId:", product);
            return;
          }
          const markdownContent = template(product);
          const productMarkdownPath = path.join(docsPath, `${productId}.md`);
          fs.writeFileSync(productMarkdownPath, markdownContent, "utf8");
          console.log(`Generated product page at: ${productMarkdownPath}`);
        });
      } else {
        console.warn(
          `Product template file not found at: ${productTemplateFile}. Skipping generation of individual product pages.`,
        );
      }

      // Update sidebars file
      if (fs.existsSync(sidebarsFile)) {
        let sidebarsContent = fs.readFileSync(sidebarsFile, "utf8");
        const productsEntry = `    "products", // Add this line to include products.md`;
        if (!sidebarsContent.includes(productsEntry)) {
          sidebarsContent = sidebarsContent.replace(
            /docgenSidebar: [\s\n]*([^\n]*?)[\s\n]*\]/s,
            (match, p1) => {
              return `docgenSidebar: [\n${p1.trim() ? p1.trim() + ",\n" : ""}${productsEntry}\n]`;
            },
          );
          fs.writeFileSync(sidebarsFile, sidebarsContent, "utf8");
          console.log(`Updated sidebars file: ${sidebarsFile}`);
        }
      } else {
        console.warn(
          `Sidebars file not found at: ${sidebarsFile}. Skipping update.`,
        );
      }

      console.log(`Output directory: ${outputDir}`);
      if (watchMode) {
        console.log(`Watch mode enabled. Watching for file changes...`);
      } else {
        console.log(`Build completed.`);
      }
    });
};
