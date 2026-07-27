import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";

export async function setupAuthentication(config) {
  if (config.authentication === "none" || !config.authentication) {
    return;
  }

  const spinner = createSpinner(
    `Setting up ${config.authentication}`
  ).start();

  try {
    switch (config.authentication) {
      case "jwt":
        await setupJWT(config);
        break;

      case "better-auth":
        await setupBetterAuth(config);
        break;
    }

    spinner.succeed(`${config.authentication} configured`);
  } catch (error) {
    spinner.fail("Authentication setup failed");
    throw error;
  }
}

async function setupJWT(config) {
  config.dependencies = {
    ...config.dependencies,
    jsonwebtoken: "^9.0.2",
    bcryptjs: "^2.4.3",
  };

  if (config.language === "ts") {
    config.devDependencies = {
      ...config.devDependencies,
      "@types/jsonwebtoken": "^9.0.7",
      "@types/bcryptjs": "^2.4.6",
    };
  }

  config.env = {
    ...config.env,
    JWT_SECRET: "",
  };

  await createAuthMiddleware(config);
  await createAuthController(config);
  await createAuthRoute(config);

  if (config.database === "mongodb") {
    await createUserModel(config);
  }
}

async function setupBetterAuth(config) {
  config.dependencies = {
    ...config.dependencies,
    "better-auth": "latest",
  };
}

async function createAuthMiddleware(config) {
  const extension = config.language === "ts" ? "ts" : "js";

  const content =
    config.language === "ts"
      ? `
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({
        message: "Unauthorized"
      });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Invalid token"
      });
  }
}
`
      : `
import jwt from "jsonwebtoken";

export function authMiddleware(
  req,
  res,
  next
) {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({
        message: "Unauthorized"
      });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Invalid token"
      });
  }
}
`;

  await writeFile(
    config,
    `src/middleware/auth.middleware.${extension}`,
    content
  );
}

async function createAuthController(config) {
  const extension = config.language === "ts" ? "ts" : "js";

  const content =
    config.language === "ts"
      ? `
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export async function login(
  req: Request,
  res: Response
) {
  const token = jwt.sign(
    {
      id: "example"
    },
    process.env.JWT_SECRET as string
  );

  res.json({
    token
  });
}
`
      : `
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function login(
  req,
  res
) {
  const token = jwt.sign(
    {
      id: "example"
    },
    process.env.JWT_SECRET
  );

  res.json({
    token
  });
}
`;

  await writeFile(
    config,
    `src/controllers/auth.controller.${extension}`,
    content
  );
}

async function createAuthRoute(config) {
  const extension = config.language === "ts" ? "ts" : "js";

  const importPath =
    config.language === "ts"
      ? "../controllers/auth.controller"
      : "../controllers/auth.controller.js";

  const content = `
import express from "express";
import { login } from "${importPath}";

const router = express.Router();

router.post(
  "/login",
  login
);

export default router;
`;

  await writeFile(
    config,
    `src/routes/auth.route.${extension}`,
    content
  );
}

async function createUserModel(config) {
  const extension = config.language === "ts" ? "ts" : "js";

  const content = `
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }
});

export default mongoose.model(
  "User",
  userSchema
);
`;

  await writeFile(
    config,
    `src/models/user.model.${extension}`,
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