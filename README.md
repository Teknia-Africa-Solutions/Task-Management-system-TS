# Task Management System

Internship project for collaborative development by three interns.

## Stack

- Frontend: React
- Backend: Node.js + Express
- Database: MySQL

## Getting started

Requires [Node.js](https://nodejs.org/) (LTS) and, later, MySQL.

```powershell
copy .env.example .env
npm install
npm install --prefix frontend
npm install --prefix backend
npm run dev
```

- Frontend: http://localhost:5173
- API health: http://localhost:3000/api/health

Fill `DB_USER` and `DB_PASSWORD` in `.env` when you connect MySQL. Do not commit `.env`.

Run apps separately if you prefer:

```powershell
npm run dev:frontend
npm run dev:backend
```

## Status

The React (Vite) frontend and Express API are scaffolded and can be started locally. Features, authentication, and database tables are not implemented yet.

## Branching

| Branch | Purpose |
| --- | --- |
| `main` | Stable / integration branch |
| `juma` | Intern development branch |
| `josphine` | Intern development branch |
| `nay` | Intern development branch |

All interns work from the **same** project structure. Tasks will be divided later; frontend, backend, and database are not assigned exclusively to one person.

Workflow:

1. Work on your intern branch (`juma`, `josphine`, or `nay`).
2. After review, merge completed work into `main`.
3. Keep `main` as the integration/stable branch.

## Project structure

```text
task-management-system/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── utils/
│       └── App.jsx
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── utils/
│   └── server.js
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── schema/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   └── project/
├── .gitignore
├── README.md
└── .env.example
```

Empty directories include a `.gitkeep` file so Git can track them.

Copy `.env.example` to `.env` when configuration is added later. Do not commit `.env`.
