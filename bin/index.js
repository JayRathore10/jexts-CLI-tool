#!/usr/bin/env node

import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

import chalk from "chalk";
import gradient from "gradient-string";
import ora from "ora";
import boxen from "boxen";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  title: gradient(["#38bdf8", "#06b6d4"]),
  primary: chalk.cyan,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  muted: chalk.gray,
  heading: chalk.bold.white
};

function divider() {
  console.log(
    colors.muted(
      "────────────────────────────────────────────────────────────"
    )
  );
}

function showHeader() {
  console.clear();

  divider();

  console.log();
  console.log(colors.title("                         JEXTS"));
  console.log(chalk.gray("                 Express Project Generator"));
  console.log();

  divider();
  console.log();
}

function showCompletion(projectName) {
  console.log();

  console.log(
    boxen(
`${chalk.green("Project created successfully.")}

${chalk.bold("Next steps")}

  ${chalk.cyan(`cd ${projectName}`)}
  ${chalk.cyan("npm run dev")}
`,
      {
        padding: 1,
        borderStyle: "round",
        borderColor: "cyan"
      }
    )
  );
}

function showInstallError(projectName) {
  console.log();

  console.log(
    boxen(
`${chalk.red("Dependency installation failed.")}

You can continue manually:

  ${chalk.cyan(`cd ${projectName}`)}
  ${chalk.cyan("npm install")}
`,
      {
        padding: 1,
        borderStyle: "round",
        borderColor: "yellow"
      }
    )
  );
}

async function promptUser() {
  return prompts([
    {
      type: "select",
      name: "language",
      message: "Language",
      choices: [
        {
          title: "TypeScript",
          value: "ts"
        },
        {
          title: "JavaScript",
          value: "js"
        }
      ]
    },
    {
      type: "text",
      name: "projectName",
      message: "Project Name",
      initial: "my-app"
    }
  ]);
}

async function createProjectDirectory(targetDir) {
  const spinner = ora("Creating project directory").start();

  try {
    await fs.mkdirp(targetDir);
    spinner.succeed("Project directory created");
  } catch (error) {
    spinner.fail("Unable to create project directory");
    throw error;
  }
}

async function copyTemplate(language, targetDir) {
  const spinner = ora("Copying template").start();

  try {
    const templateDir = path.join(
      __dirname,
      "..",
      "templates",
      language
    );

    await fs.copy(templateDir, targetDir);

    spinner.succeed("Template copied");
  } catch (error) {
    spinner.fail("Failed to copy template");
    throw error;
  }
}

async function updatePackageJson(targetDir, projectName) {
  const spinner = ora("Updating package.json").start();

  try {
    const packageJsonPath = path.join(
      targetDir,
      "package.json"
    );

    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);

      // Make the package.json's name is equal to projectName

      packageJson.name = projectName
        .toLowerCase()
        .replace(/\s+/g, "-"); // npm-safe name

      // signification of .replace(/\s+/g , "-") is
      // \s = any whiteSpace character , + indicate whitespace one or more times
      // /g represent global (replace all space with '-')

      await fs.writeJson(packageJsonPath, packageJson, {
        spaces: 2
      });
    }

    spinner.succeed("package.json updated");
  } catch (error) {
    spinner.fail("Failed to update package.json");
    throw error;
  }
}

async function configureGitignore(targetDir) {
  const spinner = ora("Configuring .gitignore").start();

  try {
    // Fix gitignore issue
    // npm don't let us to download .gitignore directly so we
    // make gitignore then conver it to .gitignore

    const gitignorePath = path.join(
      targetDir,
      "gitignore"
    );

    const dotGitignorePath = path.join(
      targetDir,
      ".gitignore"
    );

    if (await fs.pathExists(gitignorePath)) {
      await fs.rename(
        gitignorePath,
        dotGitignorePath
      );
    }

    spinner.succeed(".gitignore configured");
  } catch (error) {
    spinner.fail("Failed to configure .gitignore");
    throw error;
  }
}

async function installDependencies(targetDir, projectName) {
  const spinner = ora("Installing dependencies").start();

  try {
    execSync("npm install", {
      cwd: targetDir,
      stdio: "ignore"
    });

    spinner.succeed("Dependencies installed");
  } catch {
    spinner.fail("Dependency installation failed");

    showInstallError(projectName);

    return false;
  }

  return true;
}


async function main() {
  try {
    showHeader();

    const response = await promptUser();
    const { language, projectName } = response;

    if (!language || !projectName) {
      console.log(colors.warning("Operation cancelled."));
      process.exit(0);
    }

    // Removing the extra tailing spaces (also extra leading space)
    // if we not remove them it make the project folder but we can't access that folder

    const projectNameTrimmed = projectName.trim();

    const targetDir = path.join(
      process.cwd(),
      projectNameTrimmed
    );

    await createProjectDirectory(targetDir);

    await copyTemplate(language, targetDir);

    await updatePackageJson(
      targetDir,
      projectNameTrimmed
    );

    await configureGitignore(targetDir);

    await installDependencies(
      targetDir,
      projectNameTrimmed
    );

    showCompletion(projectNameTrimmed);
  } catch (error) {
    console.log();

    console.error(
      chalk.red.bold("An unexpected error occurred.\n")
    );

    console.error(
      chalk.gray(error instanceof Error ? error.message : String(error))
    );

    process.exit(1);
  }
}

main();


/*
  WE HAVE TO ADD CHALK TO IT FOR COLOUR FULL OUTPUT AND SO MANY THINGS TO IT .
  {FOCUS ON STYLING}
  SERVER AUTOSTART I ALSO HAVE TO ADD THIS 

  Add screenshot and logo to readme 
  and review website link in it 

  Add more features like not get all folder (selected folders)  
  Add env 

*/


/**
 * 
 * add cors like 
 * if someone wrote 
 * npm create jexts@latest --react 
 * then cors auto connect to react localhost:5173 directly no need to external insatllation and setup 
 * 
 */

/**
 * 
 * Add  docs like react to it
 * that provide a some things about the jexts 
 * 
 */