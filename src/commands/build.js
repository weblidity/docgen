const { mergeOptions } = require("../cli/utils"); // Import mergeOptions
const glob = require("glob"); // Import glob
const fs = require("fs"); // Import fs
const path = require("path"); // Import path
const Handlebars = require("handlebars"); // Import hbsr
const logger = require("../cli/logger");

module.exports = (program) => {
  program
    .command("build")
    .alias("b")
    .description("Builds the project")
    .argument(
      "[patterns...]",
      "optional list of product list filename patterns",
    )
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
    .option(
      "-p, --products-index <filename>",
      "the filename for the products index",
      "index.md",
    )
    .option("--featured-menu", "generate menu items for featured products")
    .action((patterns, options, command) => {
      const mergedOptions = mergeOptions(program, "build", options, command);

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
      const productsIndex = mergedOptions.productsIndex;

      logger.info(`Building project...`);
      logger.debug(`Patterns: ${effectivePatterns.join(", ")}`);
      logger.debug(`Ignore: ${ignore.join(", ")}`);
      logger.debug(`Docs Path: ${docsPath}`);
      logger.debug(`Sidebars File: ${sidebarsFile}`);
      logger.debug(`Templates Path: ${templatesPath}`); // Log templates path
      logger.debug(`Products Index: ${productsIndex}`);

      const matchedFiles = glob.sync(effectivePatterns, {
        ignore: ignore,
        absolute: true,
      });
      logger.debug(`Matched Files: ${matchedFiles.join(", ")}`);

      let allProducts = [];
      matchedFiles.forEach((file) => {
        try {
          const fileContent = fs.readFileSync(file, "utf8");
          const products = JSON.parse(fileContent);
          allProducts = allProducts.concat(products);
        } catch (e) {
          logger.error(`Error reading or parsing file ${file}: ${e.message}`);
        }
      });

      logger.debug("Collected Products:", JSON.stringify(allProducts, null, 2));

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
        const productsMarkdownPath = path.join(docsPath, productsIndex);
        fs.writeFileSync(productsMarkdownPath, markdownContent, "utf8");
        logger.success(
          `Generated Docusaurus product list at: ${productsMarkdownPath} using template.`,
        );
      } else {
        logger.warn(
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
        const productsMarkdownPath = path.join(docsPath, productsIndex);
        fs.writeFileSync(productsMarkdownPath, markdownContent, "utf8");
        logger.info(
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
            logger.warn("Skipping product without a productId:", product);
            return;
          }
          const markdownContent = template(product);
          const productMarkdownPath = path.join(docsPath, `${productId}.md`);
          fs.writeFileSync(productMarkdownPath, markdownContent, "utf8");
          logger.info(`Generated product page at: ${productMarkdownPath}`);
        });
      } else {
        logger.warn(
          `Product template file not found at: ${productTemplateFile}. Skipping generation of individual product pages.`,
        );
      }

      // Update sidebars file
      if (fs.existsSync(sidebarsFile)) {
        let sidebarsContent = fs.readFileSync(sidebarsFile, "utf8");
        const productsEntrySlug = path.basename(productsIndex, ".md");
        const productsEntry = `    "${productsEntrySlug}", // Add this line to include ${productsIndex}`;
        if (!sidebarsContent.includes(productsEntry)) {
          sidebarsContent = sidebarsContent.replace(
            /docgenSidebar: [\s\n]*([^\n]*?)[\s\n]*\]/s,
            (match, p1) => {
              return `docgenSidebar: [\n${p1.trim() ? p1.trim() + ",\n" : ""}${productsEntry}\n]`;
            },
          );
          fs.writeFileSync(sidebarsFile, sidebarsContent, "utf8");
          logger.info(`Updated sidebars file: ${sidebarsFile}`);
        }
      } else {
        logger.warn(
          `Sidebars file not found at: ${sidebarsFile}. Skipping update.`,
        );
      }

      logger.success(`Build completed.`);
    });
};
