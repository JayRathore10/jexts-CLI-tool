import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";

export async function setupHusky(config) {
  if (!config.features?.husky) {
    return;
  }

  const spinner = createSpinner("Setting up Husky").start();

  try {
    config.devDependencies = {
      ...config.devDependencies,
      husky: "^9.0.0"
    };

    config.scripts = {
      ...config.scripts,
      prepare: "husky"
    };

    await createHuskyFiles(config);

    spinner.succeed("Husky configured");
  } catch (error) {
    spinner.fail("Husky setup failed");
    throw error;
  }
}

async function createHuskyFiles(config) {
  const huskyDir = path.join(
    config.targetDir,
    ".husky"
  );

  await fs.ensureDir(huskyDir);

  const preCommit = `#!/bin/sh

npm run lint
`;

  const filePath = path.join(
    huskyDir,
    "pre-commit"
  );

  await fs.writeFile(filePath, preCommit);

  await fs.chmod(filePath, "755");
}