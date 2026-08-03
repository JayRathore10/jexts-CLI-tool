import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";

export async function setupExampleApi(config) {
  if (!config.features?.exampleApi) {
    return;
  }

  const spinner = createSpinner("Generating example APIs").start();

  try {
    await createController(config);
    await createRoute(config);
    await createModel(config);
    await updateApp(config);

    spinner.succeed("Example APIs generated");
  } catch (error) {
    spinner.fail("Example API generation failed");
    throw error;
  }
}

async function createController(config) {
  const extension = config.language === "ts" ? "ts" : "js";

  const content =
    config.language === "ts"
      ? `
import { Request, Response } from "express";

export const healthCheck = (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    status: "success",
    message: "API is running"
  });
};
`
      : `
export const healthCheck = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running"
  });
};
`;

  await writeFile(
    config,
    `src/controllers/health.controller.${extension}`,
    content
  );
}

async function createRoute(config) {
  const extension = config.language === "ts" ? "ts" : "js";

  const importPath =
    config.language === "ts"
      ? "../controllers/health.controller"
      : "../controllers/health.controller.js";

  const content = `
import express from "express";
import { healthCheck } from "${importPath}";

const router = express.Router();

router.get("/health", healthCheck);

export default router;
`;

  await writeFile(
    config,
    `src/routes/health.route.${extension}`,
    content
  );
}

async function createModel(config) {
  if (config.database !== "mongodb") {
    return;
  }

  const content = `
import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

export default mongoose.model("Example", exampleSchema);
`;

  const extension = config.language === "ts" ? "ts" : "js";

  await writeFile(
    config,
    `src/models/example.model.${extension}`,
    content
  );
}

async function updateApp(config) {
  const extension = config.language === "ts" ? "ts" : "js";

  const appPath = path.join(
    config.targetDir,
    "src",
    `app.${extension}`
  );

  if (!(await fs.pathExists(appPath))) {
    return;
  }

  let content = await fs.readFile(appPath, "utf-8");

  const routeImport =
    config.language === "ts"
      ? `import healthRoute from "./routes/health.route";`
      : `import healthRoute from "./routes/health.route.js";`;

  if (content.includes("healthRoute")) {
    return;
  }

  content = `${routeImport}\n\n${content}`;

  content = content.replace(
    "app.use(express.json());",
    `app.use(express.json());

app.use("/api", healthRoute);`
  );

  await fs.writeFile(appPath, content);
}

async function writeFile(config, file, content) {
  const fullPath = path.join(config.targetDir, file);

  await fs.ensureDir(path.dirname(fullPath));

  await fs.writeFile(fullPath, content.trim());
}