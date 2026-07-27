import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../utils/ui.js";


export async function createEnvFile(config) {

  if (
    !config.env ||
    Object.keys(config.env).length === 0
  ) {
    return;
  }


  const spinner = createSpinner(
    "Creating environment file"
  ).start();


  try {

    const envPath = path.join(
      config.targetDir,
      ".env.example"
    );


    let content = "";


    for (const key of Object.keys(config.env)) {

      content += `${key}=${config.env[key]}\n`;

    }


    await fs.writeFile(
      envPath,
      content
    );


    spinner.succeed(
      ".env.example created"
    );


  } catch(error) {

    spinner.fail(
      "Failed to create .env.example"
    );

    throw error;

  }
}