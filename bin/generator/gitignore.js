import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../utils/ui.js";

export async function configureGitignore(config) {
  const spinner = createSpinner("Configuring .gitignore").start();

  try {
    const gitignorePath = path.join(
      config.targetDir,
      "gitignore"
    );

    const dotGitignorePath = path.join(
      config.targetDir,
      ".gitignore"
    );

    if (await fs.pathExists(gitignorePath)) {
      await fs.rename(
        gitignorePath,
        dotGitignorePath
      );
    }

    spinner.succeed(".gitignore configured");
  } catch (error) {
    spinner.fail("Failed to configure .gitignore");
    throw error;
  }
}