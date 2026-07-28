<p align="center">
  <img src="https://raw.githubusercontent.com/JayRathore10/jexts-CLI-tool/main/assets/logo.png" alt="JEXTS">
</p>

<p align="center">
  <strong>A modern CLI for scaffolding production-ready Express.js applications.</strong>
</p>

<p align="center">
  Generate fully configured Express.js backends with an interactive setup experience.
</p>

---

## Overview

JEXTS is a Node.js CLI that helps you create Express.js backend projects in seconds. Through an interactive terminal interface, you can configure your preferred language, package manager, database, ORM, authentication, testing framework, and additional tooling before generating your project.

---

## Features

- Interactive project generator
- JavaScript and TypeScript support
- npm, pnpm, Yarn, and Bun
- Express.js project scaffolding
- Database selection
- ORM configuration
- Authentication setup
- Testing framework selection
- Optional project features
- Clean, maintainable project structure
- Ready-to-use templates

---

## Quick Start

Create a new project:

```bash
npm create jexts@latest
```

Follow the interactive prompts to configure your project.

---

## Interactive Configuration

During project creation, JEXTS lets you configure:

| Category | Options |
|----------|---------|
| Language | JavaScript, TypeScript |
| Package Manager | npm, pnpm, Yarn, Bun |
| Database | MongoDB, PostgreSQL, MySQL, None |
| ORM | Prisma, Mongoose, Drizzle, None |
| Authentication | Configurable |
| Testing | Configurable |
| Additional Features | Optional |

---

## Usage

Navigate to your project:

```bash
cd <project-name>
```

Start the development server:

```bash
npm run dev
```

For TypeScript projects:

```bash
npm run build
npm start
```

---

## Generated Project

JEXTS creates a clean, organized Express.js project structure tailored to your selected configuration.

```text
project-name/
├── src/
├── package.json
├── .gitignore
└── ...
```

---

## Requirements

- Node.js 18 or later
- npm

---

## Contributing

Contributions are welcome. If you discover a bug, have a feature request, or would like to improve JEXTS, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License.