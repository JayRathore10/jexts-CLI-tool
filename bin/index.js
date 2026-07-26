#!/usr/bin/env node

import { showHeader, showCompletion } from "./utils/ui.js";
import { promptUser } from "./prompts/index.js";
import { generateProject } from "./generator/index.js";

async function main() {
  try {
    showHeader();

    const config = await promptUser();

    await generateProject(config);

    showCompletion(config);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();