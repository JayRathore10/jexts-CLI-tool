import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";


export async function setupTesting(config) {

  if (
    config.testing === "none" ||
    !config.testing
  ) {
    return;
  }


  const spinner = createSpinner(
    `Setting up ${config.testing}`
  ).start();


  try {

    switch (config.testing) {

      case "vitest":
        await setupVitest(config);
        break;


      case "jest":
        await setupJest(config);
        break;

    }


    spinner.succeed(
      `${config.testing} configured`
    );


  } catch(error) {

    spinner.fail(
      "Testing setup failed"
    );

    throw error;
  }
}



async function setupVitest(config) {

  config.devDependencies = {
    ...config.devDependencies,

    vitest: "^3.0.0",

    "@types/node": "^22.0.0"
  };


  config.scripts = {
    ...config.scripts,

    test: "vitest"
  };


  await createTestFile(
    config,
    "example.test",
`
import { describe, it, expect } from "vitest";


describe("Example Test", () => {

  it("should work correctly", () => {

    expect(true).toBe(true);

  });

});
`
  );

}



async function setupJest(config) {


  config.devDependencies = {
    ...config.devDependencies,

    jest: "^29.0.0",

    "@types/jest": "^29.0.0"
  };


  config.scripts = {
    ...config.scripts,

    test: "jest"
  };


  const extension =
    config.language === "ts"
      ? "ts"
      : "js";


  await createTestFile(
    config,
    `example.test.${extension}`,
`
describe("Example Test", () => {

  test("should work correctly", () => {

    expect(true).toBe(true);

  });

});
`
  );

}



async function createTestFile(
  config,
  fileName,
  content
) {

  const testDir = path.join(
    config.targetDir,
    "tests"
  );


  await fs.ensureDir(testDir);


  await fs.writeFile(
    path.join(
      testDir,
      fileName
    ),
    content.trim()
  );

}