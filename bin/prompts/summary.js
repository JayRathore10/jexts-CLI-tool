import prompts from "prompts";
import chalk from "chalk";

export async function promptSummary(config) {
  console.log();

  console.log(chalk.bold.white("Configuration"));
  console.log();

  console.log(`${chalk.gray("Project")}         ${config.projectName}`);
  console.log(`${chalk.gray("Language")}        ${config.language === "ts" ? "TypeScript" : "JavaScript"}`);
  console.log(`${chalk.gray("Package")}         ${config.packageManager}`);
  console.log(`${chalk.gray("Database")}        ${format(config.database)}`);

  if (config.database !== "none") {
    console.log(`${chalk.gray("ORM / ODM")}      ${format(config.orm)}`);
  }

  console.log(`${chalk.gray("Authentication")} ${format(config.authentication)}`);
  console.log(`${chalk.gray("Testing")}         ${format(config.testing)}`);

  console.log();

  console.log(chalk.bold.white("Features"));
  console.log();

  if (config.eslint) console.log(chalk.green("✓ ESLint"));
  if (config.prettier) console.log(chalk.green("✓ Prettier"));
  if (config.husky) console.log(chalk.green("✓ Husky"));
  if (config.git) console.log(chalk.green("✓ Git"));
  if (config.docker) console.log(chalk.green("✓ Docker"));
  if (config.swagger) console.log(chalk.green("✓ Swagger"));
  if (config.exampleApi) console.log(chalk.green("✓ Example APIs"));

  console.log();

  const response = await prompts({
    type: "confirm",
    name: "continue",
    message: "Generate project?",
    initial: true
  });

  return response.continue;
}

function format(value) {
  if (value === "none") return "None";

  return value
    .split("-")
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}