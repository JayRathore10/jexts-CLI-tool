import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../utils/ui.js";


export async function updateServer(config) {

  if (
    config.orm !== "mongoose"
  ) {
    return;
  }


  const spinner = createSpinner(
    "Configuring database connection"
  ).start();


  try {

    const serverFile =
      config.language === "ts"
        ? "server.ts"
        : "server.js";


    const serverPath = path.join(
      config.targetDir,
      "src",
      serverFile
    );


    if (!await fs.pathExists(serverPath)) {
      spinner.succeed(
        "Server configuration skipped"
      );
      return;
    }


    let content = await fs.readFile(
      serverPath,
      "utf-8"
    );


    const importLine =
      config.language === "ts"
        ? `import { connectDB } from "./configs/db.config";`
        : `import { connectDB } from "./configs/db.config.js";`;


    if (!content.includes("connectDB")) {

      content =
`${importLine}

${content}`;


      content = content.replace(
        "const PORT = process.env.PORT || 3000;",
        `const PORT = process.env.PORT || 3000;\n\nconnectDB();`
      );


      await fs.writeFile(
        serverPath,
        content
      );

    }


    spinner.succeed(
      "Database connection configured"
    );


  } catch(error) {

    spinner.fail(
      "Failed to configure database connection"
    );

    throw error;

  }
}