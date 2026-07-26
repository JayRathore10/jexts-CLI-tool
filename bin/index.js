#!/usr/bin/env node

import { showHeader } from "./utils/ui.js";
import { promptUser } from "./prompts/index.js";
import { generateProject } from "./generator/index.js";
import { showCompletion } from "./utils/ui.js";

async function main() {
  showHeader();

  const config = await promptUser();

  await generateProject(config);

  showCompletion(config);
}

main();