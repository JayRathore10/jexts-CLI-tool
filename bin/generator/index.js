import { createProject } from "./createProject.js";
import { copyTemplate } from "./copyTemplate.js";
import { setupFeatures } from "./features/index.js";
import { updatePackageJson } from "./packageJson.js";
import { configureGitignore } from "./gitignore.js";
import { installDependencies } from "./installDependencies.js";
import { initializeGit } from "./initializeGit.js";

export async function generateProject(config) {
  await createProject(config);

  await copyTemplate(config);

  await setupFeatures(config);

  await updatePackageJson(config);

  await configureGitignore(config);

  await installDependencies(config);

  await initializeGit(config);
}