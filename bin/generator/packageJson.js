import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../utils/ui.js";


export async function updatePackageJson(config) {

  const spinner = createSpinner(
    "Updating package.json"
  ).start();


  try {

    const packageJsonPath = path.join(
      config.targetDir,
      "package.json"
    );


    if (await fs.pathExists(packageJsonPath)) {

      const packageJson = await fs.readJson(
        packageJsonPath
      );


      // Make the package.json's name is equal to projectName 

      packageJson.name = config.projectName
        .toLowerCase()
        .replace(/\s+/g, "-");


      if (config.dependencies) {

        packageJson.dependencies = {
          ...packageJson.dependencies,
          ...config.dependencies
        };

      }


      if (config.devDependencies) {

        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          ...config.devDependencies
        };

      }


      if (config.scripts) {

        packageJson.scripts = {
          ...packageJson.scripts,
          ...config.scripts
        };

      }


      await fs.writeJson(
        packageJsonPath,
        packageJson,
        {
          spaces: 2
        }
      );

    }


    spinner.succeed(
      "package.json updated"
    );


  } catch(error) {

    spinner.fail(
      "Failed to update package.json"
    );

    throw error;

  }
}