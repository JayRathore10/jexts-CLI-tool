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



async function updateAppFile(config){


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
  ){
    return;
  }


  let content =
    await fs.readFile(
      appPath,
      "utf-8"
    );



  let imports = "";

  let routes = "";



  if(
    config.features?.exampleApi
  ){

    imports +=
config.language === "ts"
?
`import healthRoute from "./routes/health.route";\n`
:
`import healthRoute from "./routes/health.route.js";\n`;


    routes +=
`
app.use(
  "/api",
  healthRoute
);
`;

  }



  if(
    config.authentication === "jwt"
  ){

    imports +=
config.language === "ts"
?
`import authRoute from "./routes/auth.route";\n`
:
`import authRoute from "./routes/auth.route.js";\n`;


    routes +=
`
app.use(
  "/api/auth",
  authRoute
);
`;

  }



  if(imports){

    content =
imports + "\n" + content;

  }



  if(routes){

    content =
content.replace(
"app.use(express.json());",

`
app.use(express.json());

${routes}
`
);

  }



  await fs.writeFile(
    appPath,
    content
  );

}





async function updateServerFile(config){


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
  ){

    return;

  }



  let content =
    await fs.readFile(
      serverPath,
      "utf-8"
    );



  if(
    config.database !== "none"
  ){


    const dbImport =
config.language === "ts"
?
`import { connectDB } from "./configs/db.config";`
:
`import { connectDB } from "./configs/db.config.js";`;


    content =
dbImport +
"\n" +
content;



    content =
content.replace(
"// Connect DB locally",
`
connectDB();

// Connect DB locally
`
);

  }



  await fs.writeFile(
    serverPath,
    content
  );

}