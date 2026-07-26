import { promptProjectName } from "./projectName.js";
import { promptLanguage } from "./language.js";
import { promptPackageManager } from "./packageManager.js";
import { promptDatabase } from "./database.js";
import { promptORM } from "./orm.js";
import { promptAuthentication } from "./authentication.js";
import { promptTesting } from "./testing.js";
import { promptFeatures } from "./features.js";
import { promptSummary } from "./summary.js";

export {
  promptProjectName,
  promptLanguage,
  promptPackageManager,
  promptDatabase,
  promptORM,
  promptAuthentication,
  promptTesting,
  promptFeatures,
  promptSummary
};

export async function promptUser() {
  const { projectName, packageName } = await promptProjectName();

  const language = await promptLanguage();

  const packageManager = await promptPackageManager();

  const database = await promptDatabase();

  const orm = await promptORM(database);

  const authentication = await promptAuthentication();

  const testing = await promptTesting();

  const features = await promptFeatures();

  const config = {
    projectName,
    packageName,
    language,
    packageManager,
    database,
    orm,
    authentication,
    testing,
    features
  };

  const shouldGenerate = await promptSummary(config);

  if (!shouldGenerate) {
    process.exit(0);
  }

  return config;
}