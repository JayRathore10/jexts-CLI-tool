import { setupDatabase } from "./database.js";
import { setupORM } from "./orm.js";
import { setupAuthentication } from "./authentication.js";
import { setupTesting } from "./testing.js";
import { setupESLint } from "./eslint.js";
import { setupPrettier } from "./prettier.js";
import { setupHusky } from "./husky.js";
import { setupDocker } from "./docker.js";
import { setupSwagger } from "./swagger.js";
import { setupExampleApi } from "./exampleApi.js";

export async function setupFeatures(config) {
  await setupDatabase(config);

  await setupORM(config);

  await setupAuthentication(config);

  await setupTesting(config);

  await setupESLint(config);

  await setupPrettier(config);

  await setupHusky(config);

  await setupDocker(config);

  await setupSwagger(config);

  await setupExampleApi(config);
}