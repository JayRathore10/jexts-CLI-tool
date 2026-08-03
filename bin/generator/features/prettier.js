import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";

export async function setupPrettier(config) {
  if (!config.features?.prettier) {
    return;
  }

  const spinner = createSpinner("Setting up Prettier").start();

  try {
    config.devDependencies = {
      ...config.devDependencies,
      prettier: "^3.0.0"
    };

    config.scripts = {
      ...config.scripts,
      format: "prettier --write ."
    };

    await createPrettierFiles(config);

    spinner.succeed("Prettier configured");
  } catch (error) {
    spinner.fail("Prettier setup failed");
    throw error;
  }
}

async function createPrettierFiles(config) {
  const prettierConfig = `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
`;

  const prettierIgnore = `
node_modules
dist
.env
`;

  await fs.writeFile(
    path.join(config.targetDir, ".prettierrc"),
    prettierConfig.trim()
  );

  await fs.writeFile(
    path.join(config.targetDir, ".prettierignore"),
    prettierIgnore.trim()
  );
}

