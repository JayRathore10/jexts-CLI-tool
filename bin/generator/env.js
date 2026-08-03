import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../utils/ui.js";

export async function createEnvFile(config) {
  if (!config.env || Object.keys(config.env).length === 0) {
    return;
  }

  const spinner = createSpinner("Creating environment file").start();

  try {
    const envPath = path.join(
      config.targetDir,
      ".env.example"
    );

    let content = "";

    for (const [key, value] of Object.entries(config.env)) {
      content += `${key}=${value}\n`;
    }

    await fs.writeFile(envPath, content);

    spinner.succeed(".env.example created");
  } catch (error) {
    spinner.fail("Failed to create environment file");
    throw error;
  }
}
