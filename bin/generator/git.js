import { execSync } from "child_process";
import { createSpinner } from "../utils/ui.js";


export async function initializeGit(config) {

  if (!config.git) {
    return;
  }


  const spinner = createSpinner(
    "Initializing git repository"
  ).start();


  try {

    execSync(
      "git init",
      {
        cwd: config.targetDir,
        stdio: "ignore"
      }
    );


    spinner.succeed(
      "Git repository initialized"
    );


  } catch(error) {


    spinner.fail(
      "Failed to initialize git repository"
    );


    throw error;

  }

}