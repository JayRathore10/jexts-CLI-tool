# jexts

`jexts` is a Node.js CLI tool to quickly scaffold **Express backend projects** in **JavaScript or TypeScript**. It simplifies project setup so you can start coding immediately.

## Features

* Generate a ready-to-use Express backend in JS or TS
* Pre-configured folder structure with templates
* Works with `npm create` for fast project initialization

## Installation

You don’t need to install globally. Use `npm create`:

```bash
npm create jexts@latest
```

Follow the prompts to select **JavaScript** or **TypeScript** and project name.

## Usage

After creating your project, navigate to it:

```bash
cd <project-name>
```

Run development server:

```bash
# For JS projects
npm run dev

# For TS projects
npm run dev
```

Build and start (for TS projects):

```bash
npm run build
npm start
```

## Project Structure

A typical project looks like:

```
project-name/
├─ src/          # Source files (TS or JS)
├─ dist/         # Compiled files (TS only)
├─ .gitignore
├─ node_modules/
├─ package.json
└─ tsconfig.json # Only for TS projects
```

## Contributing

Contributions are welcome! Open an issue or pull request for improvements or fixes.

## License

MIT License
