# LAB — Internal Cybersecurity Evaluation Platform

A self-contained, localhost-only CTF platform built with **Node.js + Express + SQLite**.
Ten progressive operational phases covering observation, reconnaissance, web vulnerabilities,
authentication failures, source disclosure, steganography, classical cryptography, and OSINT.

The interface is restrained, dark, and clinical — modeled after internal enterprise tooling.
There are no cloud dependencies. Everything runs on your machine.

---

## 1. Required software

- **Node.js v18 or newer** — https://nodejs.org
- **npm** (bundled with Node.js)
- A modern browser (Chrome, Firefox, Edge, Safari)

Verify your install:

```bash
node --version    # v18.0.0 or higher
npm  --version
```

---

## 2. Installation

```bash
# 1. Unzip the project
unzip ctf-platform.zip
cd ctf-platform

# 2. Install dependencies
npm install
```

`better-sqlite3` will compile a small native binding during install. On Windows you may
need the "Desktop development with C++" workload (Visual Studio Build Tools) installed.
On macOS/Linux the system toolchain is sufficient.

---

## 3. Start the server

```bash
npm start
```

Output:

```
[ LAB ] Internal Evaluation Platform
[ LAB ] Listening on http://localhost:3000
```

Open: **http://localhost:3000**

The SQLite database file (`database.sqlite`) is created automatically on first start.

---

## 4. Default credentials

| Surface       | Credential                       |
|---------------|----------------------------------|
| Operator      | Self-register on the home page   |
| Administrator | password: `admin123` at `/admin` |

To change the admin password set `ADMIN_PASSWORD` in the environment.

---

## 5. Folder structure

```
ctf-platform/
├── server.js              Express bootstrap, session config, route mounting
├── package.json
├── database.sqlite        Created at runtime
├── .env.example           Environment template
│
├── db/database.js         SQLite schema + connection
├── routes/                HTTP routing (auth, evaluation, challenges, success, admin, pages)
├── middleware/auth.js     Session + per-round access control
├── services/              Backend authority (flag registry, progression engine)
├── public/                Shared static assets (css, js, manifest.json)
├── views/                 Top-level pages (register, dashboard, success, admin, ...)
├── challenges/            One folder per phase, each fully isolated
└── admin/                 Reserved for future admin tooling
```

---

## 6. How sessions work

- `express-session` issues a signed cookie on registration.
- The `playerId` is the only authoritative claim stored in the session.
- All progression decisions are made server-side from the `players` table.
- The frontend is **never** the source of truth — it cannot self-promote rounds.
- Sessions persist across page refresh and browser restart (1-week cookie TTL).

---

## 7. How SQLite is used

Three tables (see `db/database.js`):

- **players** — operator profile, current round, score, elapsed time, solved phases.
- **round_metrics** — per-round timer entries (start, end, elapsed seconds).
- **submissions** — every flag submission (correct or rejected) with timestamp.

Reset the entire database:

```bash
rm database.sqlite
npm start
```

Or reset a single operator from the admin panel (`/admin` → Reset).

---

## 8. Progression flow

1. Operator registers at `/` → backend creates record → session opened → timer 1 started.
2. Immediate redirect to `/challenge/1` (no passive landing on the dashboard).
3. Correct flag → `/success/{n}` confirmation screen → "Proceed to next phase" button.
4. After phase 10 → `/evaluation-complete` final ledger.

Players cannot skip rounds, revisit completed rounds for credit, or access locked routes.
All gating is enforced by `middleware/auth.js`.

---

## 9. Adding or modifying challenges

Each challenge lives in `challenges/challengeN/` and serves a static `index.html`. The
flag is held only in `services/flags.js` on the backend — never in the HTML.

To add an 11th phase:

1. Add `services/flags.js` entry: `11: 'CTF{NEW_FLAG}'`.
2. Update the `for (let i = 1; i <= 10; ...)` loops in `routes/challenges.js`,
   `routes/success.js`, `services/progression.js` (Math.min cap), and `views/dashboard.html`.
3. Create `challenges/challenge11/index.html`.

To change a flag, edit `services/flags.js` — no other file changes required.

---

## 10. Troubleshooting

| Symptom                                  | Resolution                                                 |
|------------------------------------------|------------------------------------------------------------|
| `Error: Cannot find module ...`          | Run `npm install` again.                                   |
| `better-sqlite3` build failure on Windows | Install Visual Studio Build Tools with C++ workload.       |
| Port 3000 already in use                 | `PORT=4000 npm start`                                      |
| Need to wipe everything                  | Stop the server, `rm database.sqlite`, `npm start`.        |
| Forgot admin password                    | Restart with `ADMIN_PASSWORD=newpass npm start`.           |
| Stuck on a phase                         | Admin → Unlock → set the operator's `current_round`.       |

---

## 11. Security note

This platform is intentionally vulnerable in **specific places** that form the puzzles
(unsanitized DOM rendering, JWT `alg: none`, predictable IDs, exposed source maps).
**Do not deploy to the public internet.** It is a localhost evaluation tool.

---

Built for internal technical assessment. Restrained by design.
