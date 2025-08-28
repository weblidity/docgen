const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");

const cliPath = path.resolve(__dirname, "../bin/cli.js");
const tempDir = path.resolve(__dirname, "temp");

// Helper function to create a directory if it doesn't exist
const ensureDir = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
};

// Helper function to clean up the temp directory
const cleanup = async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
};

describe("Build Command Tests", () => {
  beforeAll(async () => {
    await cleanup(); // Clean up before all tests
    await ensureDir(tempDir);
  });

  afterAll(async () => {
    await cleanup(); // Clean up after all tests
  });

  beforeEach(async () => {
    await cleanup(); // Clean up before each test
    await ensureDir(tempDir);
  });

  // Test case for default behavior
  test("should build using default templates", (done) => {
    const setup = async () => {
      // Create test files and directories
      await ensureDir(path.join(tempDir, "templates"));
      await ensureDir(path.join(tempDir, "website", "docs"));
      await ensureDir(path.join(tempDir, "__products__"));

      await fs.writeFile(
        path.join(tempDir, "templates", "product-index.hbs"),
        "Product Index: {{#each products}}{{this.label}}{{/each}}",
      );
      await fs.writeFile(
        path.join(tempDir, "templates", "product.hbs"),
        "Product Page: {{label}}",
      );
      await fs.writeFile(
        path.join(tempDir, "__products__", "sample.products.json"),
        JSON.stringify([{ label: "Product A", productId: "prod-a" }]),
      );
      await fs.writeFile(
        path.join(tempDir, "config.json"),
        JSON.stringify({
          build: {
            patterns: ["__products__/**/*.json"],
            docs: "website/docs",
            templates: "templates",
            templateFiles: {
              product: "product.hbs",
              productIndex: "product-index.hbs",
            },
          },
        }),
      );
    };

    setup().then(() => {
      exec(
        `node "${cliPath}" build --config "${path.join(tempDir, "config.json")}"`,
        { cwd: tempDir },
        async (error, stdout, stderr) => {
          if (error) {
            console.error(stderr);
            done(error);
            return;
          }

          // Check for product index file
          const indexContent = await fs.readFile(
            path.join(tempDir, "website", "docs", "products.md"),
            "utf8",
          );
          expect(indexContent).toBe("Product Index: Product A");

          // Check for individual product file
          const productContent = await fs.readFile(
            path.join(tempDir, "website", "docs", "prod-a.md"),
            "utf8",
          );
          expect(productContent).toBe("Product Page: Product A");

          done();
        },
      );
    });
  });

  // Test case for --templates option
  test("should use custom templates folder specified with --templates", (done) => {
    const setup = async () => {
      await ensureDir(path.join(tempDir, "custom-templates"));
      await ensureDir(path.join(tempDir, "website", "docs"));
      await ensureDir(path.join(tempDir, "__products__"));

      await fs.writeFile(
        path.join(tempDir, "custom-templates", "product-index.hbs"),
        "Custom Index: {{#each products}}{{this.label}}{{/each}}",
      );
      await fs.writeFile(
        path.join(tempDir, "custom-templates", "product.hbs"),
        "Custom Product: {{label}}",
      );
      await fs.writeFile(
        path.join(tempDir, "__products__", "sample.products.json"),
        JSON.stringify([{ label: "Product B", productId: "prod-b" }]),
      );
      await fs.writeFile(
        path.join(tempDir, "config.json"),
        JSON.stringify({
          build: {
            patterns: ["__products__/**/*.json"],
            docs: "website/docs",
            templateFiles: {
              product: "product.hbs",
              productIndex: "product-index.hbs",
            },
          },
        }),
      );
    };

    setup().then(() => {
      exec(
        `node "${cliPath}" build --config "${path.join(tempDir, "config.json")}" --templates "custom-templates"`,
        { cwd: tempDir },
        async (error, stdout, stderr) => {
          if (error) {
            console.error(stderr);
            done(error);
            return;
          }

          const indexContent = await fs.readFile(
            path.join(tempDir, "website", "docs", "products.md"),
            "utf8",
          );
          expect(indexContent).toBe("Custom Index: Product B");

          const productContent = await fs.readFile(
            path.join(tempDir, "website", "docs", "prod-b.md"),
            "utf8",
          );
          expect(productContent).toBe("Custom Product: Product B");

          done();
        },
      );
    });
  });

  // Test case for custom productIndex in config
  test("should use productIndex from config file", (done) => {
    const setup = async () => {
      await ensureDir(path.join(tempDir, "templates"));
      await ensureDir(path.join(tempDir, "website", "docs"));
      await ensureDir(path.join(tempDir, "__products__"));

      await fs.writeFile(
        path.join(tempDir, "templates", "custom-index.hbs"),
        "Config Index: {{#each products}}{{this.label}}{{/each}}",
      );
      await fs.writeFile(
        path.join(tempDir, "templates", "product.hbs"),
        "Config Product: {{label}}",
      );
      await fs.writeFile(
        path.join(tempDir, "__products__", "sample.products.json"),
        JSON.stringify([{ label: "Product C", productId: "prod-c" }]),
      );
      await fs.writeFile(
        path.join(tempDir, "config.json"),
        JSON.stringify({
          build: {
            patterns: ["__products__/**/*.json"],
            docs: "website/docs",
            templates: "templates",
            templateFiles: {
              product: "product.hbs",
              productIndex: "custom-index.hbs",
            },
          },
        }),
      );
    };

    setup().then(() => {
      exec(
        `node "${cliPath}" build --config "${path.join(tempDir, "config.json")}"`,
        { cwd: tempDir },
        async (error, stdout, stderr) => {
          if (error) {
            console.error(stderr);
            done(error);
            return;
          }

          const indexContent = await fs.readFile(
            path.join(tempDir, "website", "docs", "products.md"),
            "utf8",
          );
          expect(indexContent).toBe("Config Index: Product C");

          const productContent = await fs.readFile(
            path.join(tempDir, "website", "docs", "prod-c.md"),
            "utf8",
          );
          expect(productContent).toBe("Config Product: Product C");

          done();
        },
      );
    });
  });
});
