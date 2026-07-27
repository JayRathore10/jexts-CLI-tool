#!/usr/bin/env node

import { showHeader, showCompletion } from "./utils/ui.js";
import { promptUser } from "./prompts/index.js";
import { generateProject } from "./generator/index.js";

process.on(
  "SIGINT",
  () => {
    console.log("\n\nCancelled.");
    process.exit(0);
  }
);

async function main() {
  try {
    showHeader();

    const config = await promptUser();

    await generateProject(config);

    showCompletion(config);

  } catch (error) {
    console.log();

    console.error(
      "✖ JEXTS failed to create project"
    );

    console.error(error.message);

    process.exit(1);
  }
}

main();