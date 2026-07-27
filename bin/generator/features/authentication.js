import prompts from "prompts";

export async function promptAuthentication() {
  const { authentication } = await prompts({
    type: "select",
    name: "authentication",
    message: "Authentication",
    initial: 0,
    choices: [
      {
        title: "None",
        value: "none"
      },
      {
        title: "JWT",
        value: "jwt"
      },
      {
        title: "Better Auth",
        value: "better-auth"
      }
    ]
  });

  return authentication;
}