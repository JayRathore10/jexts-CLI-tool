import prompts from "prompts";
import { detectPackageManager } from "../utils/packageManager.js";

export async function promptPackageManager() {
  const detectedPackageManager = detectPackageManager();

  const response = await prompts({
    type: "select",
    name: "packageManager",
    message: "Package Manager",
    initial: ["npm", "pnpm", "yarn", "bun"].indexOf(detectedPackageManager),
    choices: [
      {
        title:
          detectedPackageManager === "npm"
            ? "npm (detected)"
            : "npm",
        value: "npm"
      },
      {
        title:
          detectedPackageManager === "pnpm"
            ? "pnpm (detected)"
            : "pnpm",
        value: "pnpm"
      },
      {
        title:
          detectedPackageManager === "yarn"
            ? "yarn (detected)"
            : "yarn",
        value: "yarn"
      },
      {
        title:
          detectedPackageManager === "bun"
            ? "bun (detected)"
            : "bun",
        value: "bun"
      }
    ]
  });

  return response.packageManager;
}