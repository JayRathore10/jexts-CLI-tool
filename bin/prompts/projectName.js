import prompts from "prompts";
import validate from "validate-npm-package-name";

function toPackageName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export async function promptProjectName() {
  const response = await prompts({
    type: "text",
    name: "projectName",
    message: "Project name",
    initial: "my-app",

    validate(value) {
      const trimmed = value.trim();

      if (!trimmed) {
        return "Project name cannot be empty.";
      }

      const packageName = toPackageName(trimmed);

      const result = validate(packageName);

      if (!result.validForNewPackages) {
        return "Please enter a valid npm package name.";
      }

      return true;
    }
  });

  const projectName = response.projectName.trim();

  return {
    projectName,
    packageName: toPackageName(projectName)
  };
}