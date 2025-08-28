const { mergeOptions } = require("../cli/utils"); // Import mergeOptions
const glob = require("glob"); // Import glob
const fs = require("fs"); // Import fs
const path = require("path"); // Import path

module.exports = (program) => {
  program
    .command("build")
    .alias("b")
    .description("Builds the project")
    .argument("[patterns...]","optional list of product list filename patterns")
    .option("-o, --output <directory>","specify output directory", "dist")
    .option("-w, --watch", "watch files for changes and rebuild automatically")
    .option("-i, --ignore <patterns...>","patterns of files to ignore when matching files to retrieve", [])
    .action((patterns, options) => {
      const mergedOptions = mergeOptions(program, 'build', options);

      const effectivePatterns = patterns.length > 0 ? patterns : (program.config.build && program.config.build.patterns ? program.config.build.patterns : []);
      const ignore = mergedOptions.ignore;

      const outputDir = mergedOptions.output;
      const watchMode = mergedOptions.watch;

      console.log(`Building project...`);
      console.log(`Patterns: ${effectivePatterns.join(', ')}`);
      console.log(`Ignore: ${ignore.join(', ')}`);

      const matchedFiles = glob.sync(effectivePatterns, { ignore: ignore, absolute: true });
      console.log(`Matched Files: ${matchedFiles.join(', ')}`);

      let allProducts = [];
      matchedFiles.forEach(file => {
        try {
          const fileContent = fs.readFileSync(file, 'utf8');
          const products = JSON.parse(fileContent);
          allProducts = allProducts.concat(products);
        } catch (e) {
          console.error(`Error reading or parsing file ${file}: ${e.message}`);
        }
      });

      console.log('Collected Products:', JSON.stringify(allProducts, null, 2));

      // Generate Docusaurus Markdown
      const docsDir = path.resolve(process.cwd(), 'website/docs');
      const productsMarkdownPath = path.join(docsDir, 'products.md');

      // Ensure docs directory exists
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }

      let markdownContent = '# All Products\n\n';
      if (allProducts.length > 0) {
        markdownContent += 'Here is a list of all collected products:\n\n';
        allProducts.forEach(product => {
          const label = product.label || product; // Handle string or object product
          const productId = product.productId || (typeof product === 'string' ? product.toLowerCase().replace(/\s/g, '-') : '');
          markdownContent += `- [${label}](/docs/${productId})\n`; // Assuming product pages will be at /docs/product-id
        });
      } else {
        markdownContent += 'No products found.\n';
      }

      fs.writeFileSync(productsMarkdownPath, markdownContent, 'utf8');
      console.log(`Generated Docusaurus product list at: ${productsMarkdownPath}`);


      console.log(`Output directory: ${outputDir}`);
      if (watchMode) {
        console.log(`Watch mode enabled. Watching for file changes...`);
      } else {
        console.log(`Build completed.`);
      }
    });
};