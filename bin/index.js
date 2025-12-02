#!/usr/bin/env node
import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const response = await prompts([
    {
      type: "select",
      name: "language",
      message: "Select language",
      choices: [
        { title: "TypeScript", value: "ts" },
        { title: "JavaScript", value: "js" }
      ]
    },
    {
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-app"
    }
  ]);

  const { language, projectName } = response;

  // Removing the extra tailing spaces (also extra leading space)
  // if we not remove them it make the project folder but we can't access that folder 

  const projectNameTrimmed = projectName.trim();

  const targetDir = path.join(process.cwd(), projectNameTrimmed);
  await fs.mkdirp(targetDir);

  // copy template
  const templateDir = path.join(__dirname, "..", "templates", language);
  await fs.copy(templateDir, targetDir);

  // Fix gitignore issue 
  // npm don't let us to download .gitignore directly so we 
  // make gitignore then conver it to .gitignore 
  
  const gitignorePath = path.join(targetDir, "gitignore");
  const dotGitignorePath = path.join(targetDir, ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    await fs.rename(gitignorePath, dotGitignorePath);
  }

  console.log("\nProject created successfully.");
  console.log("Installing dependencies...\n");

  try {
    execSync("npm install", { stdio: "inherit", cwd: targetDir });
    console.log("\nInstallation complete.");
  } catch (err) {
    console.log("\nFailed to run npm install.");
  }

  console.log(`\nNext steps:`);
  console.log(`cd ${projectNameTrimmed}`);
  console.log(`npm run dev`);
}

main();
