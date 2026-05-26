# LAB — Internal Cybersecurity Evaluation Platform

A self-contained, localhost-only CTF platform built with **Node.js, Express, and SQLite**.

The platform contains **10 progressive operational phases** focused on:

- Observation
- Reconnaissance
- Web vulnerabilities
- Authentication failures
- Source disclosure
- Steganography
- Classical cryptography
- OSINT

The interface is intentionally restrained, dark, and clinical — modeled after internal enterprise tooling.

There are no cloud dependencies. Everything runs entirely on your machine.

---

# Features

- Fully offline localhost deployment
- Persistent SQLite storage
- Session-based progression tracking
- Admin control panel
- Per-round timing metrics
- Submission logging
- Backend-authoritative progression
- Isolated challenge architecture
- Intentionally vulnerable challenge surfaces

---

# Tech Stack

| Component | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | SQLite |
| Authentication | express-session |
| Frontend | Static HTML/CSS/JS |
| Runtime | Localhost only |

---

# 1. Requirements

Install the following before starting:

- Node.js v18 or newer
- npm (bundled with Node.js)
- Git (recommended)
- Modern browser (Chrome, Firefox, Edge, Safari)

---

# 2. Install Node.js

Download Node.js from:

https://nodejs.org

After installation verify:

```bash
node --version
npm --version
```

Expected output:

```bash
v18.x.x
9.x.x
```

or newer.

---

# 3. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/kunal949/CTF-lab-26
```

Move into the project folder:

```bash
cd ctf-platform
```

---

# 4. Alternative ZIP Installation

If you downloaded a ZIP archive instead of cloning:

```bash
# Extract the archive first
unzip ctf-platform.zip

# Enter the project directory
cd ctf-platform
```

Windows users can simply extract using File Explorer.

---

# 5. Install Dependencies

Run:

```bash
npm install
```

This installs all required packages.

---

# 6. Native SQLite Build Notes

The package `better-sqlite3` compiles a native binding during installation.

## Windows

You may need:

- Visual Studio Build Tools
- "Desktop development with C++" workload

Download:

https://visualstudio.microsoft.com/visual-cpp-build-tools/

Then rerun:

```bash
npm install
```

## Linux / macOS

The default system toolchain is usually sufficient.

---

# 7. Environment Configuration (Optional)

Create an environment file:

## Windows

```bash
copy .env.example .env
```

## macOS / Linux

```bash
cp .env.example .env
```

Example `.env`:

```env
PORT=3000
ADMIN_PASSWORD=admin123
SESSION_SECRET=change_this_secret
```

You can leave defaults unchanged for local use.

---

# 8. Start the Server

Run:

```bash
npm start
```

Expected output:

```bash
[ LAB ] Internal Evaluation Platform
[ LAB ] Listening on http://localhost:3000
```

Open in your browser:

```text
http://localhost:3000
```

The SQLite database (`database.sqlite`) is automatically created on first launch.

---

# 9. Default Credentials

| Surface | Credential |
|---|---|
| Operator | Self-register from the homepage |
| Administrator | `/admin` → password: `admin123` |

To change the admin password:

```bash
ADMIN_PASSWORD=newpassword npm start
```

Windows PowerShell:

```powershell
$env:ADMIN_PASSWORD="newpassword"
npm start
```

---

# 10. Project Structure

```text
ctf-platform/
├── server.js
├── package.json
├── database.sqlite
├── .env.example
│
├── db/
│   └── database.js
│
├── routes/
│   ├── auth.js
│   ├── challenges.js
│   ├── success.js
│   ├── admin.js
│   └── pages.js
│
├── middleware/
│   └── auth.js
│
├── services/
│   ├── flags.js
│   └── progression.js
│
├── public/
│   ├── css/
│   ├── js/
│   └── manifest.json
│
├── views/
│
├── challenges/
│   ├── challenge1/
│   ├── challenge2/
│   └── ...
│
└── admin/
```

---

# 11. Session Architecture

- `express-session` issues a signed session cookie after registration.
- Only `playerId` is stored in the session.
- All progression validation happens server-side.
- The frontend is never trusted as an authority.
- Sessions persist for 1 week by default.

---

# 12. Database Overview

SQLite uses three primary tables:

| Table | Purpose |
|---|---|
| `players` | Operator profiles, progression, score |
| `round_metrics` | Per-round timing information |
| `submissions` | All submitted flags and timestamps |

Database file:

```text
database.sqlite
```

Created automatically during first launch.

---

# 13. Resetting the Database

Delete the database file:

## macOS / Linux

```bash
rm database.sqlite
```

## Windows PowerShell

```powershell
del database.sqlite
```

Restart the server:

```bash
npm start
```

---

# 14. Progression Flow

1. User registers on `/`
2. Backend creates operator record
3. Session is issued
4. Round 1 timer starts
5. User is redirected to `/challenge/1`
6. Correct flag submission unlocks success screen
7. Success screen advances to next phase
8. Completing phase 10 unlocks `/evaluation-complete`

Security rules:

- Players cannot skip phases
- Locked routes are inaccessible
- Completed rounds cannot be replayed for credit
- Progression is enforced in `middleware/auth.js`

---

# 15. Challenge Development

Each challenge exists inside:

```text
challenges/challengeN/
```

Every challenge serves a static:

```text
index.html
```

Flags are stored only on the backend inside:

```text
services/flags.js
```

Flags are never embedded directly in frontend HTML.

---

# 16. Adding a New Challenge

To create an 11th challenge:

## Step 1 — Add the flag

Edit:

```text
services/flags.js
```

Add:

```js
11: 'CTF{NEW_FLAG}'
```

---

## Step 2 — Update challenge loops

Update loops in:

```text
routes/challenges.js
routes/success.js
services/progression.js
views/dashboard.html
```

Replace:

```js
for (let i = 1; i <= 10; i++)
```

with:

```js
for (let i = 1; i <= 11; i++)
```

Also update any `Math.min(..., 10)` caps.

---

## Step 3 — Create challenge folder

Create:

```text
challenges/challenge11/
```

Add:

```text
index.html
```

---

# 17. Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module` | Run `npm install` again |
| `better-sqlite3` build fails | Install Visual Studio Build Tools |
| Port 3000 already in use | `PORT=4000 npm start` |
| Database corruption | Delete `database.sqlite` |
| Forgot admin password | Set `ADMIN_PASSWORD` before launch |
| Session issues | Clear browser cookies |
| Stuck on a phase | Use admin panel to unlock progression |

---

# 18. Security Notice

This platform intentionally contains vulnerable implementations as part of the challenge design, including:

- Unsanitized DOM rendering
- Weak JWT validation (`alg: none`)
- Predictable identifiers
- Exposed source maps
- Client-side information leaks

This project is designed strictly for:

- Localhost use
- Internal training
- Technical evaluation
- Controlled environments

## DO NOT DEPLOY TO THE PUBLIC INTERNET

---

# 19. License

This project is intended for educational and internal assessment use.

Modify and extend freely for private training environments.

---

Built for internal technical assessment.

Restrained by design.
