import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";


export async function setupDatabase(config) {

  if (config.database === "none") {
    return;
  }

  const spinner = createSpinner(
    `Setting up ${config.database} database`
  ).start();


  try {

    switch (config.database) {

      case "mongodb":
        await setupMongoDB(config);
        break;


      case "postgresql":
        await setupPostgreSQL(config);
        break;


      case "mysql":
        await setupMySQL(config);
        break;

    }


    spinner.succeed(
      `${config.database} database configured`
    );


  } catch (error) {

    spinner.fail(
      "Database setup failed"
    );

    throw error;
  }
}



async function setupMongoDB(config) {


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


  const configDir = path.join(
    config.targetDir,
    "src",
    "configs"
  );


  await fs.ensureDir(configDir);


  await fs.writeFile(
    path.join(configDir, file),
    content.trim()
  );

}



async function setupPostgreSQL(config) {

  config.env = {
    ...config.env,
    DATABASE_URL: ""
  };


  config.dependencies = {
    ...config.dependencies
  };

}



async function setupMySQL(config) {

  config.env = {
    ...config.env,
    DATABASE_URL: ""
  };


  config.dependencies = {
    ...config.dependencies
  };

} 