import prompts from "prompts";

export async function promptDatabase() {
  const response = await prompts({
    type: "select",
    name: "database",
    message: "Database",
    initial: 0,
    choices: [
      {
        title: "None",
        value: "none"
      },
      {
        title: "MongoDB",
        value: "mongodb"
      },
      {
        title: "PostgreSQL",
        value: "postgresql"
      },
      {
        title: "MySQL",
        value: "mysql"
      }
    ]
  });

  return response.database ?? "none";
}