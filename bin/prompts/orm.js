import prompts from "prompts";

export async function promptORM(database) {

  // Skip ORM when no database is selected
  if (database === "none") {
    return "none";
  }


  let choices = [];


  if (database === "mongodb") {

    choices = [
      {
        title: "None",
        value: "none"
      },
      {
        title: "Mongoose",
        value: "mongoose"
      }
    ];

  }


  if (
    database === "postgresql" ||
    database === "mysql"
  ) {

    choices = [
      {
        title: "None",
        value: "none"
      },
      {
        title: "Prisma",
        value: "prisma"
      },
      {
        title: "Drizzle",
        value: "drizzle"
      }
    ];

  }


  const response = await prompts({
    type: "select",
    name: "orm",
    message: "ORM / ODM",
    initial: 0,
    choices
  });


  return response.orm ?? "none";
}