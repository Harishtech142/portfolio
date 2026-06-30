# TrexFlow Contact Server

A small, standalone Node.js + Express backend that powers the portfolio's
"Get In Touch" form. It does two things on every valid submission:

1. Emails the full submission to the site owner's Gmail.
2. Sends an automatic "Thank You for Contacting TrexFlow" confirmation to the visitor.

This is a **separate deployable service** from the Vite frontend — deploy it
on its own, then point the frontend at its URL.

## 1. Get a Gmail App Password (required)

Nodemailer cannot use your normal Gmail password — Google blocks that for
third-party apps. You need an **App Password** instead:

1. Go to <https://myaccount.google.com/security> and turn on **2-Step Verification** (required first).
2. Go to <https://myaccount.google.com/apppasswords>.
3. Create a new app password (name it e.g. "TrexFlow Portfolio").
4. Copy the 16-character code Google gives you.

## 2. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `.env` and fill in:
- `GMAIL_USER` — already set to `harisinghhari2008@gmail.com`
- `GMAIL_APP_PASSWORD` — paste the 16-character app password from step 1
- `ALLOWED_ORIGIN` — your deployed frontend URL (comma-separated if more than one)

**Never commit `.env` to git.** It's already in `.gitignore`.

## 3. Run locally

```bash
npm install
npm run dev
```

Server starts on `http://localhost:4000`. Test it:

```bash
curl http://localhost:4000/api/health
# {"ok":true}
```

## 4. Deploy

Pick whichever you're most comfortable with — all three use the exact same code.

### Option A — Render or Railway (recommended, simplest)
1. Push this `server/` folder to its own GitHub repo (or a subfolder of your monorepo).
2. Create a new **Web Service** on Render, or a new project on Railway.
3. Build command: `npm install` · Start command: `npm start`.
4. Add the environment variables from `.env` in the host's dashboard (never paste them into code).
5. Once deployed, you'll get a URL like `https://TrexFlow-contact.onrender.com`.

### Option B — Vercel (serverless)
1. From the `server/` folder: `vercel deploy` (or connect the repo in the Vercel dashboard).
2. Add the same environment variables in the Vercel project settings.
3. Vercel will detect `api/contact.js` automatically; `vercel.json` routes all paths to it.
4. Your endpoint will be `https://your-project.vercel.app/api/contact`.

### Option C — Any VPS / Node host
```bash
npm install
npm start
```
Put it behind a process manager like PM2 and a reverse proxy (nginx/Caddy) with HTTPS.

## 5. Point the frontend at it

In the **frontend** project root, create a `.env` file (copy `.env.example`)
and set:

```
VITE_CONTACT_API_URL=https://your-deployed-backend-url/api/contact
```

If this variable is left unset, the frontend automatically falls back to
the existing Formspree integration, so the site never breaks even before
you deploy this backend.

## API

`POST /api/contact`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "company": "Acme Inc",
  "service": "AI Automation",
  "budget": "$5,000 - $10,000",
  "message": "We'd like to automate our lead intake process."
}
```

Responses:
- `200 { "ok": true }` — sent successfully
- `400 { "ok": false, "fieldErrors": { ... } }` — validation failed
- `429 { "ok": false, "error": "..." }` — rate limited (max 5 / 15 min / IP)
- `502 { "ok": false, "error": "..." }` — email delivery failed (Gmail unreachable, bad credentials, etc.)

## Security notes

- Credentials are read **only** from environment variables — never hardcoded, never returned in API responses.
- CORS is locked to `ALLOWED_ORIGIN` — set this before deploying publicly.
- Rate limiting caps abuse at 5 submissions per IP every 15 minutes.
- A honeypot field (`_gotcha`) silently absorbs basic bots without alerting them.
- All inputs are length-capped and HTML-escaped before being placed in email bodies.
