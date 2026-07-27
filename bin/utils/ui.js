import ora from "ora";
import boxen from "boxen";
import { colors } from "./colors.js";

export function divider() {
  console.log(
    colors.muted(
      "────────────────────────────────────────────────────────────"
    )
  );
}

export function showHeader() {
  console.clear();

  divider();

  console.log();
  console.log(colors.title("                         JEXTS"));
  console.log(colors.muted("                 Express Project Generator"));
  console.log();

  divider();
  console.log();
}

export function createSpinner(message) {
  return ora({
    text: message,
    color: "cyan"
  });
}

export function showCompletion(config) {

  const projectName = config.projectName;
  const packageManager = config.packageManager;


  const runCommand =
    packageManager === "npm"
      ? "npm run dev"
      : packageManager === "yarn"
      ? "yarn dev"
      : `${packageManager} dev`;


  console.log();


  console.log(
    boxen(
`${colors.success("Project created successfully.")}

${colors.heading("Next steps")}

  ${colors.primary(`cd ${projectName}`)}
  ${colors.primary(runCommand)}
`,
      {
        padding: 1,
        borderStyle: "round",
        borderColor: "cyan"
      }
    )
  );

}

export function showInstallError(config) {
  console.log();

  console.log(
    boxen(
`Dependency installation failed.

You can continue manually:

cd ${config.projectName}
${getInstallCommand(config.packageManager)}
`,
      {
        padding: 1,
        borderStyle: "round",
        borderColor: "yellow"
      }
    )
  );
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