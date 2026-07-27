import fs from "fs-extra";
import path from "path";

import { setupFeatures } from "./features/index.js";
import { updatePackageJson } from "./packageJson.js";
import { createEnvFile } from "./env.js";
import { updateServer } from "./updateServer.js";
import { configureGitignore } from "./gitignore.js";
import { initializeGit } from "./git.js";
import { installDependencies } from "./install.js";
import { ROOT_DIR } from "../utils/paths.js";

export async function generateProject(config) {
  const targetDir = path.join(
    process.cwd(),
    config.projectName
  );


  config.targetDir = targetDir;

  await createProjectDirectory(
    targetDir
  );

  await copyTemplate(
    config
  );

  await createEnvFile(
    config
  );

  await setupFeatures(
    config
  );

  await updatePackageJson(
    config
  );

  await updateServer(
    config
  );


  await configureGitignore(
    config
  );

  if (config.git) {

    await initializeGit(
      config
    );

  }

  await installDependencies(
    config
  );


}

async function createProjectDirectory(
  targetDir
) {

  await fs.mkdirp(
    targetDir
  );

}

async function copyTemplate(
  config
) {

  const templateDir =
    path.join(
      ROOT_DIR,
      "templates",
      config.language
    );


  await fs.copy(
    templateDir,
    config.targetDir
  );

}