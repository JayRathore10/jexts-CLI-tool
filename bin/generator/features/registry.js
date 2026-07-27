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


const features = [
  setupDatabase,
  setupORM,
  setupAuthentication,
  setupTesting,
  setupESLint,
  setupPrettier,
  setupHusky,
  setupDocker,
  setupSwagger,
  setupExampleApi
];



export async function featureRegistry(config) {

  for (const feature of features) {

    await feature(config);

  }

}