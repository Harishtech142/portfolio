// Vercel serverless entrypoint. Vercel auto-detects files under /api and
// invokes the default export as a request handler — no app.listen() needed.
// Deploy this `server` folder as its own separate Vercel project
// (it is independent from the Vite frontend).
import app from '../src/app.js';

export default app;
