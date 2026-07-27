import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../utils/ui.js";


export async function updateServer(config) {

  const spinner = createSpinner(
    "Configuring server"
  ).start();


  try {

    await updateAppFile(config);

    await updateServerFile(config);


    spinner.succeed(
      "Server configured"
    );


  } catch(error) {


    spinner.fail(
      "Failed to configure server"
    );


    throw error;

  }

}





async function updateAppFile(config) {


  const extension =
    config.language === "ts"
      ? "ts"
      : "js";


  const appPath = path.join(
    config.targetDir,
    "src",
    `app.${extension}`
  );


  if(
    !await fs.pathExists(appPath)
  ) {
    return;
  }



  let content =
    await fs.readFile(
      appPath,
      "utf-8"
    );



  let imports = [];

  let routes = "";



  // Example API

  if(config.exampleApi) {


    imports.push(
      config.language === "ts"
        ? `import healthRoute from "./routes/health.route";`
        : `import healthRoute from "./routes/health.route.js";`
    );


    routes += `

app.use(
  "/api",
  healthRoute
);
`;

  }



  // JWT Authentication

  if(
    config.authentication === "jwt"
  ) {


    imports.push(
      config.language === "ts"
        ? `import authRoute from "./routes/auth.route";`
        : `import authRoute from "./routes/auth.route.js";`
    );


    routes += `

app.use(
  "/api/auth",
  authRoute
);
`;

  }




  // Add imports only if missing

  if(imports.length) {


    const newImports =
      imports
        .filter(
          item =>
            !content.includes(item)
        )
        .join("\n");



    if(newImports) {


      content =
        content.replace(
          "import express",
          `${newImports}\n\nimport express`
        );

    }

  }




  // Add routes

  if(routes) {


    if(
      !content.includes("app.use(\n  \"/api\"")
    ) {


      content =
        content.replace(
          "app.use(express.json());",
`
app.use(express.json());

${routes}
`
        );

    }

  }




  await fs.writeFile(
    appPath,
    content
  );

}







async function updateServerFile(config) {


  const extension =
    config.language === "ts"
      ? "ts"
      : "js";



  const serverPath =
    path.join(
      config.targetDir,
      "src",
      `server.${extension}`
    );



  if(
    !await fs.pathExists(serverPath)
  ) {
    return;
  }




  let content =
    await fs.readFile(
      serverPath,
      "utf-8"
    );




  if(
    config.database &&
    config.database !== "none"
  ) {


    const dbImport =
      config.language === "ts"
        ? `import { connectDB } from "./configs/db.config";`
        : `import { connectDB } from "./configs/db.config.js";`;



    if(
      !content.includes(dbImport)
    ) {


      content =
        dbImport +
        "\n" +
        content;

    }




    if(
      !content.includes("connectDB();")
    ) {


      content =
        content.replace(
          "// Connect DB locally",
          "connectDB();"
        );

    }

  }




  await fs.writeFile(
    serverPath,
    content
  );

}