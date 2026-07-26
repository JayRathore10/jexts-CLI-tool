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

export function showCompletion(projectName, packageManager) {
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

export function showInstallError(projectName, packageManager) {
  const installCommand =
    packageManager === "npm"
      ? "npm install"
      : packageManager === "pnpm"
      ? "pnpm install"
      : packageManager === "bun"
      ? "bun install"
      : "yarn";

  console.log();

  console.log(
    boxen(
`${colors.error("Dependency installation failed.")}

You can continue manually:

  ${colors.primary(`cd ${projectName}`)}
  ${colors.primary(installCommand)}
`,
      {
        padding: 1,
        borderStyle: "round",
        borderColor: "yellow"
      }
    )
  );
}