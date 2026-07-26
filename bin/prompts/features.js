import prompts from "prompts";

export async function promptFeatures() {
  const response = await prompts({
    type: "multiselect",
    name: "features",
    message: "Features",
    hint: "- Space to select · Enter to continue",
    instructions: false,
    choices: [
      {
        title: "ESLint",
        value: "eslint",
        selected: true
      },
      {
        title: "Prettier",
        value: "prettier",
        selected: true
      },
      {
        title: "Husky",
        value: "husky"
      },
      {
        title: "Initialize Git Repository",
        value: "git",
        selected: true
      },
      {
        title: "Docker",
        value: "docker"
      },
      {
        title: "Swagger",
        value: "swagger"
      },
      {
        title: "Example APIs",
        value: "exampleApi"
      }
    ]
  });

  return {
    eslint: response.features.includes("eslint"),
    prettier: response.features.includes("prettier"),
    husky: response.features.includes("husky"),
    git: response.features.includes("git"),
    docker: response.features.includes("docker"),
    swagger: response.features.includes("swagger"),
    exampleApi: response.features.includes("exampleApi")
  };
}