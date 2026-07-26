import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { createSpinner } from "../utils/ui.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyTemplate(config) {
  const spinner = createSpinner("Copying project template").start();

  try {
    const templateDir = path.join(
      __dirname,
      "..",
      "..",
      "templates",
      config.language
    );

    await fs.copy(templateDir, config.targetDir);

    spinner.succeed("Project template copied");
  } catch (error) {
    spinner.fail("Failed to copy project template");
    throw error;
  }
}