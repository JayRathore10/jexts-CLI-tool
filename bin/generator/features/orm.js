import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";


export async function setupORM(config) {

  if (
    config.orm === "none" ||
    !config.orm
  ) {
    return;
  }


  const spinner = createSpinner(
    `Setting up ${config.orm}`
  ).start();


  try {

    switch (config.orm) {

      case "mongoose":
        await setupMongoose(config);
        break;


      case "prisma":
        await setupPrisma(config);
        break;


      case "drizzle":
        await setupDrizzle(config);
        break;

    }


    spinner.succeed(
      `${config.orm} configured`
    );


  } catch (error) {

    spinner.fail(
      `${config.orm} setup failed`
    );

    throw error;
  }
}



async function setupMongoose(config) {

  config.dependencies = {
    ...config.dependencies,
    mongoose: "^9.0.0"
  };


  config.env = {
    ...config.env,
    MONGODB_URI: ""
  };


  const file =
    config.language === "ts"
      ? "db.config.ts"
      : "db.config.js";


  const content =
    config.language === "ts"

      ? `
import mongoose from "mongoose";

export const connectDB = async () => {
  try {

    await mongoose.connect(
      process.env.MONGODB_URI!
    );

    console.log("Database connected successfully");

  } catch (error) {

    console.log(error);
    process.exit(1);

  }
};
`

      :

      `
import mongoose from "mongoose";

export const connectDB = async () => {
  try {

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("Database connected successfully");

  } catch (error) {

    console.log(error);
    process.exit(1);

  }
};
`;


  await createFile(
    config,
    `src/configs/${file}`,
    content
  );

}

async function setupPrisma(config) {

  config.dependencies = {
    ...config.dependencies,
    "@prisma/client": "latest"
  };


  config.devDependencies = {
    ...config.devDependencies,
    prisma: "latest"
  };


  await createFile(
    config,
    "prisma/schema.prisma",
`
generator client {
  provider = "prisma-client-js"
}


datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`
  );


  config.env = {
    ...config.env,
    DATABASE_URL: ""
  };

}

async function setupDrizzle(config) {

  config.dependencies = {
    ...config.dependencies,
    "drizzle-orm": "latest"
  };

  config.devDependencies = {
    ...config.devDependencies,
    "drizzle-kit": "latest"
  };


  config.env = {
    ...config.env,
    DATABASE_URL: ""
  };

}



async function createFile(
  config,
  filePath,
  content
) {

  const fullPath = path.join(
    config.targetDir,
    filePath
  );


  await fs.ensureDir(
    path.dirname(fullPath)
  );


  await fs.writeFile(
    fullPath,
    content.trim()
  );

}