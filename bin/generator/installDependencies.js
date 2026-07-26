import { spawnSync } from "child_process";
import { createSpinner, showInstallError } from "../utils/ui.js";

export async function installDependencies(config) {
  const spinner = createSpinner("Installing dependencies").start();

  try {
    const { command, args } = getInstallCommand(
      config.packageManager
    );

    spinner.stop();

    const result = spawnSync(command, args, {
      cwd: config.targetDir,
      stdio: "inherit",
      shell: true
    });

    if (result.status !== 0) {
      throw new Error();
    }

    spinner.succeed("Dependencies installed");
  } catch (error) {
    spinner.fail("Dependency installation failed");

    showInstallError(config);

    throw error;
  }
}

function getInstallCommand(packageManager) {
  switch (packageManager) {
    case "pnpm":
      return {
        command: "pnpm",
        args: ["install"]
      };

    case "yarn":
      return {
        command: "yarn",
        args: []
      };

    case "bun":
      return {
        command: "bun",
        args: ["install"]
      };

    default:
      return {
        command: "npm",
        args: ["install"]
      };
  }
}