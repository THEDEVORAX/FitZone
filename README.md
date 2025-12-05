# 🏋️‍♂️ FitZone

**FitZone** is a modern full-stack fitness platform built with TypeScript, designed to deliver a seamless and scalable experience for fitness enthusiasts and developers alike. Developed by the team at [Devorax](https://github.com/THEDEVORAX), this project showcases clean architecture, modular structure, and cutting-edge technologies.

---

## 🚀 Features

- ⚡ Fast and responsive front-end powered by Vite
- 🧠 Type-safe codebase using TypeScript across the stack
- 🗂️ Modular folder structure: `client`, `server`, `shared`, and more
- 🧬 Drizzle ORM for modern and type-safe database management
- 🔄 Shared logic between front-end and back-end
- 🧪 Ready for testing, scaling, and future enhancements

---

## 📁 Project Structure
FitZone/ 
├── client/ # Front-end application 
├── server/ # Back-end services and APIs 
├── shared/ # Shared types and utilities 
├── drizzle/ # Database schema and config 
├── patches/ # External patches or overrides 
├── todo.md # Development notes and roadmap 
├── package.json # Project metadata and scripts 
├── tsconfig.json # TypeScript configuration 
├── vite.config.ts # Vite build configuration

---

## 🛠️ Tech Stack

| Tool/Library     | Purpose                          |
|------------------|----------------------------------|
| **TypeScript**   | Strongly typed JavaScript        |
| **Vite**         | Lightning-fast front-end tooling |
| **Drizzle ORM**  | Type-safe database management    |
| **Node.js**      | Back-end runtime                 |
| **pnpm**         | Fast and efficient package manager |

---

## 🧪 Getting Started

```bash
# Install dependencies
pnpm install

# Start the front-end
cd client
pnpm dev

# Start the back-end
cd ../server
pnpm dev
