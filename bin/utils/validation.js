import validate from "validate-npm-package-name";

export function normalizeProjectName(name) {
  return name.trim();
}

export function toPackageName(name) {
  return normalizeProjectName(name)
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function validateProjectName(name) {
  const trimmed = normalizeProjectName(name);

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