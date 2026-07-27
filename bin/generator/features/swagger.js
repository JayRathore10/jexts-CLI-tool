import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";


export async function setupSwagger(config) {

  if (
    !config.features?.swagger
  ) {
    return;
  }


  const spinner = createSpinner(
    "Setting up Swagger"
  ).start();


  try {

    config.dependencies = {
      ...config.dependencies,

      "swagger-jsdoc": "^6.2.8",
      "swagger-ui-express": "^5.0.0"
    };


    if (config.language === "ts") {

      config.devDependencies = {
        ...config.devDependencies,

        "@types/swagger-ui-express": "^4.1.8"
      };

    }


    await createSwaggerConfig(config);

    await updateAppFile(config);


    spinner.succeed(
      "Swagger configured"
    );


  } catch(error) {

    spinner.fail(
      "Swagger setup failed"
    );

    throw error;

  }

}



async function createSwaggerConfig(config) {


  const extension =
    config.language === "ts"
      ? "ts"
      : "js";


  const swaggerContent =
`
const swaggerDefinition = {
  openapi: "3.0.0",

  info: {
    title: "JEXTS API",
    version: "1.0.0",
    description: "API documentation"
  },

  servers: [
    {
      url: "http://localhost:3000"
    }
  ]
};


export default swaggerDefinition;
`;


  const swaggerDir = path.join(
    config.targetDir,
    "src",
    "configs"
  );


  await fs.ensureDir(
    swaggerDir
  );


  await fs.writeFile(
    path.join(
      swaggerDir,
      `swagger.config.${extension}`
    ),
    swaggerContent.trim()
  );

}



async function updateAppFile(config) {


  const appFile =
    config.language === "ts"
      ? "app.ts"
      : "app.js";


  const appPath = path.join(
    config.targetDir,
    "src",
    appFile
  );


  if (!await fs.pathExists(appPath)) {
    return;
  }


  let content = await fs.readFile(
    appPath,
    "utf-8"
  );


  if (
    content.includes("swagger-ui-express")
  ) {
    return;
  }


  const importCode =
    config.language === "ts"

      ?

`
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./configs/swagger.config";
`

      :

`
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./configs/swagger.config.js";
`;


  content =
`${importCode}

${content}`;



  content = content.replace(
    "app.use(express.json());",
`
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig)
);
`
  );


  await fs.writeFile(
    appPath,
    content
  );

}