import fs from "fs";
import path from "path";

export function detectPackageManager() {
  const cwd = process.cwd();

  if (fs.existsSync(path.join(cwd, "bun.lockb"))) {
    return "bun";
  }

  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }

  if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
    return "npm";
  }

  return "npm";
}

export function getInstallCommand(packageManager) {
  switch (packageManager) {
    case "pnpm":
      return "pnpm install";

    case "yarn":
      return "yarn";

    case "bun":
      return "bun install";

    default:
      return "npm install";
  }
}

export function getRunCommand(packageManager) {
  switch (packageManager) {
    case "pnpm":
      return "pnpm dev";

    case "yarn":
      return "yarn dev";

    case "bun":
      return "bun run dev";

    default:
      return "npm run dev";
  }
}