import { spawnSync } from "child_process";
import { createSpinner, showInstallError } from "../utils/ui.js";
import { getInstallCommand } from "../utils/packageManager.js";

export async function installDependencies(config) {
  const spinner = createSpinner("Installing dependencies").start();

  try {
    const { command, args } = getInstallCommand(
      config.packageManager
    );

    console.log({
      packageManager: config.packageManager,
      command,
      args,
      targetDir: config.targetDir
    });

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
    spinner.fail(
      "Dependency installation failed"
    );

    console.error(error);

    showInstallError(config);

    throw error;
  }
}
