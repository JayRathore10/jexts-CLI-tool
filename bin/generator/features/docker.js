import fs from "fs-extra";
import path from "path";
import { createSpinner } from "../../utils/ui.js";


export async function setupDocker(config) {

  if (!config.features?.docker) {
    return;
  }


  const spinner = createSpinner(
    "Setting up Docker"
  ).start();


  try {

    await createDockerfile(config);

    await createDockerIgnore(config);

    await createDockerCompose(config);


    spinner.succeed(
      "Docker configured"
    );


  } catch(error) {

    spinner.fail(
      "Docker setup failed"
    );

    throw error;

  }

}



async function createDockerfile(config) {

  const dockerfile = `FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
`;


  await fs.writeFile(
    path.join(
      config.targetDir,
      "Dockerfile"
    ),
    dockerfile.trim()
  );

}



async function createDockerIgnore(config) {

  const dockerIgnore = `
node_modules
dist
.env
.git
.gitignore
`;

  await fs.writeFile(
    path.join(
      config.targetDir,
      ".dockerignore"
    ),
    dockerIgnore.trim()
  );

}

async function createDockerCompose(config) {

  let services = `
services:

  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
`;


  if (config.database === "mongodb") {

    services += `

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
`;


    services += `

volumes:
  mongodb_data:
`;

  }


  if (config.database === "postgresql") {

    services += `

  postgres:
    image: postgres:latest
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data


volumes:
  postgres_data:
`;

  }


  if (config.database === "mysql") {

    services += `

  mysql:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: app
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql


volumes:
  mysql_data:
`;

  }


  await fs.writeFile(
    path.join(
      config.targetDir,
      "docker-compose.yml"
    ),
    services.trim()
  );

}