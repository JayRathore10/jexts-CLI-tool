import prompts from "prompts";

export async function promptLanguage() {
  const response = await prompts({
    type: "select",
    name: "language",
    message: "Language",
    initial: 0,
    choices: [
      {
        title: "TypeScript",
        value: "ts"
      },
      {
        title: "JavaScript",
        value: "js"
      }
    ]
  });

  return response.language;
}