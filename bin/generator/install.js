import { execSync } from "child_process";
import { createSpinner } from "../utils/ui.js";
import { getInstallCommand } from "../utils/packageManager.js";


export async function installDependencies(config) {

  const command = getInstallCommand(
    config.packageManager
  );


  const spinner = createSpinner(
    "Installing dependencies"
  ).start();


  try {

    execSync(
      command,
      {
        cwd: config.targetDir,
        stdio: "ignore"
      }
    );


    spinner.succeed(
      "Dependencies installed"
    );


  } catch(error) {


    spinner.fail(
      "Dependency installation failed"
    );


    throw error;

  }

}
