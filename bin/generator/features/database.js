import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";

export async function setupDatabase(config) {
  if (
    config.database === "none" ||
    !config.database
  ) {
    return;
  }

  const spinner = createSpinner(
    `Setting up ${config.database}`
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
      `${config.database} configured`
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
    MONGODB_URI: "mongodb://localhost:27017/myDB"
  };

  const extension =
    config.language === "ts"
      ? "ts"
      : "js";

  const content = `
import mongoose from "mongoose";

export const connectDB = async()=>{

  try{

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      "MongoDB connected successfully"
    );

  }catch(error){

    console.log(error);

    process.exit(1);

  }

};
`;

  await writeFile(
    config,
    `src/configs/db.config.${extension}`,
    content
  );
}

async function setupPostgreSQL(config) {
  config.dependencies = {
    ...config.dependencies,
    pg: "^8.12.0"
  };

  config.env = {
    ...config.env,
    DATABASE_URL: "postgresql://user:password@localhost:5432/mydb"
  };

  await createSQLConfig(
    config,
    "postgresql"
  );
}

async function setupMySQL(config) {
  config.dependencies = {
    ...config.dependencies,
    mysql2: "^3.11.0"
  };

  config.env = {
    ...config.env,
    DATABASE_URL: "mysql://user:password@localhost:3306/mydb"
  };

  await createSQLConfig(
    config,
    "mysql"
  );
}

async function createSQLConfig(
  config,
  database
) {
  const extension =
    config.language === "ts"
      ? "ts"
      : "js";

  let content = "";

  if (database === "postgresql") {
    content = `
import { Pool } from "pg";

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL
});

export const connectDB = async()=>{
  let client;
  try{

    client = await pool.connect();

    console.log(
      "PostgreSQL connected successfully"
    );

    client.release();

  }catch(error){

    console.log(error);

    process.exit(1);

  }

};
`;
  }

  if (database === "mysql") {
    content = `
import mysql from "mysql2/promise";

export const pool = mysql.createPool(
  process.env.DATABASE_URL
);

export const connectDB = async () => {
  try {
    const connection =
      await pool.getConnection();

    console.log(
      "MySQL connected successfully"
    );

    connection.release();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
`;
  }

  await writeFile(
    config,
    `src/configs/db.config.${extension}`,
    content
  );
}

async function writeFile(
  config,
  file,
  content
) {
  const filePath = path.join(
    config.targetDir,
    file
  );

  await fs.ensureDir(
    path.dirname(filePath)
  );

  await fs.writeFile(
    filePath,
    content.trim()
  );
}