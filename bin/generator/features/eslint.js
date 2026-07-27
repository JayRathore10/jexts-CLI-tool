import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";


export async function setupESLint(config) {

  if (
    !config.features?.eslint
  ) {
    return;
  }


  const spinner = createSpinner(
    "Setting up ESLint"
  ).start();


  try {

    config.devDependencies = {
      ...config.devDependencies,

      eslint: "^9.0.0"
    };


    config.scripts = {
      ...config.scripts,

      lint: "eslint ."
    };


    await createESLintConfig(config);


    spinner.succeed(
      "ESLint configured"
    );


  } catch(error) {

    spinner.fail(
      "ESLint setup failed"
    );

    throw error;

  }

}



async function createESLintConfig(config) {


  const fileName =
    "eslint.config.js";


  const eslintConfig = `
// ESLint configuration

export default [
  {
    ignores: [
      "node_modules",
      "dist"
    ]
  }
];
`;


  await fs.writeFile(
    path.join(
      config.targetDir,
      fileName
    ),
    eslintConfig.trim()
  );

}