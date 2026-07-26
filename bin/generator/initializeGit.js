import { spawnSync } from "child_process";
import { createSpinner } from "../utils/ui.js";

export async function initializeGit(config) {
  if (!config.features.git) {
    return;
  }

  const spinner = createSpinner("Initializing Git repository").start();

  try {
    const result = spawnSync(
      "git",
      ["init"],
      {
        cwd: config.targetDir,
        stdio: "ignore",
        shell: true
      }
    );

    if (result.status !== 0) {
      throw new Error();
    }

    spinner.succeed("Git repository initialized");
  } catch (error) {
    spinner.fail("Failed to initialize Git");

    throw error;
  }
}