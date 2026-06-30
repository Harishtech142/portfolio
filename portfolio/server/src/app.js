import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

/* ─────────────────────────────────────────────────────────────────────────
   ENV / CONFIG
   All secrets come from environment variables ONLY — never hardcode them.
   See .env.example for the full list of required variables.
   ───────────────────────────────────────────────────────────────────────── */
const {
  PORT = 4000,
  GMAIL_USER,            // the Gmail address that sends & receives mail
  GMAIL_APP_PASSWORD,    // 16-char Google App Password (NOT your login password)
  OWNER_EMAIL,           // where contact submissions get delivered (defaults to GMAIL_USER)
  ALLOWED_ORIGIN,        // comma-separated list of allowed frontend origins
  BRAND_NAME = 'SmartFlow',
} = process.env;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error(
    '[FATAL] Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables.\n' +
    'Copy .env.example to .env and fill in real values before starting the server.'
  );
  process.exit(1);
}

const ownerEmail = OWNER_EMAIL || GMAIL_USER;
const allowedOrigins = (ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);

/* ─────────────────────────────────────────────────────────────────────────
   APP SETUP
   ───────────────────────────────────────────────────────────────────────── */
const app = express();
app.use(express.json({ limit: '20kb' })); // small limit — this is a contact form, not a file upload

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (curl/health checks) and any explicitly listed origin.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));

// Prevent abuse: max 5 contact submissions per IP per 15 minutes.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests. Please try again later.' },
});

/* ─────────────────────────────────────────────────────────────────────────
   MAIL TRANSPORT
   ───────────────────────────────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

/* ─────────────────────────────────────────────────────────────────────────
   VALIDATION (server-side — never trust the client)
   ───────────────────────────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { name: 100, email: 150, company: 150, service: 100, budget: 60, message: 5000 };

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validateBody(body) {
  const errors = {};
  const { name, email, company, service, budget, message, _gotcha } = body;

  // Honeypot — if filled, treat as spam (caller decides how to respond).
  if (_gotcha) return { errors: { _spam: true } };

  if (typeof name !== 'string' || !name.trim() || name.trim().length < 2 || name.length > MAX_LEN.name) {
    errors.name = 'Name is required (2-100 characters).';
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim()) || email.length > MAX_LEN.email) {
    errors.email = 'A valid email address is required.';
  }
  if (company && (typeof company !== 'string' || company.length > MAX_LEN.company)) {
    errors.company = 'Company name is too long.';
  }
  if (service && (typeof service !== 'string' || service.length > MAX_LEN.service)) {
    errors.service = 'Service value is too long.';
  }
  if (budget && (typeof budget !== 'string' || budget.length > MAX_LEN.budget)) {
    errors.budget = 'Budget value is too long.';
  }
  if (typeof message !== 'string' || !message.trim() || message.trim().length < 10 || message.length > MAX_LEN.message) {
    errors.message = 'Message is required (10-5000 characters).';
  }

  return { errors, clean: Object.keys(errors).length === 0 ? {
    name: name.trim(),
    email: email.trim(),
    company: (company || '').trim(),
    service: (service || '').trim(),
    budget: (budget || '').trim(),
    message: message.trim(),
  } : null };
}

/* ─────────────────────────────────────────────────────────────────────────
   ROUTES
   ───────────────────────────────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { errors, clean } = validateBody(req.body || {});

  if (errors._spam) {
    // Don't tell bots they were caught — respond as if it succeeded.
    return res.json({ ok: true });
  }
  if (!clean) {
    return res.status(400).json({ ok: false, fieldErrors: errors });
  }

  const { name, email, company, service, budget, message } = clean;

  try {
    // 1) Notify the site owner with the full submission.
    await transporter.sendMail({
      from: `"${BRAND_NAME} Website" <${GMAIL_USER}>`,
      to: ownerEmail,
      replyTo: email,
      subject: `New inquiry from ${name}${company ? ` (${company})` : ''}`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Company: ${company || '—'}\n` +
        `Service: ${service || '—'}\n` +
        `Budget: ${budget || '—'}\n\n` +
        `Message:\n${message}\n`,
      html: `
        <h2>New portfolio inquiry</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>Company</strong></td><td>${escapeHtml(company) || '—'}</td></tr>
          <tr><td><strong>Service</strong></td><td>${escapeHtml(service) || '—'}</td></tr>
          <tr><td><strong>Budget</strong></td><td>${escapeHtml(budget) || '—'}</td></tr>
        </table>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      `,
    });

    // 2) Send an automatic confirmation email to the visitor.
    await transporter.sendMail({
      from: `"${BRAND_NAME}" <${GMAIL_USER}>`,
      to: email,
      subject: `Thank You for Contacting ${BRAND_NAME}`,
      text:
        `Hello ${name},\n\n` +
        `Thank you for contacting ${BRAND_NAME}.\n\n` +
        `We have successfully received your inquiry.\n\n` +
        `Our team will review your request and get back to you within 24 hours.\n\n` +
        `Thank you for choosing ${BRAND_NAME}.\n\n` +
        `Best Regards,\n${BRAND_NAME} Team`,
      html:
        `<p>Hello ${escapeHtml(name)},</p>` +
        `<p>Thank you for contacting <strong>${BRAND_NAME}</strong>.</p>` +
        `<p>We have successfully received your inquiry. Our team will review your request and get back to you within 24 hours.</p>` +
        `<p>Thank you for choosing ${BRAND_NAME}.</p>` +
        `<p>Best Regards,<br/>${BRAND_NAME} Team</p>`,
    });

    return res.json({ ok: true });
  } catch (err) {
    // Log full detail server-side only; never leak internals to the client.
    console.error('[contact] mail send failed:', err.message);
    return res.status(502).json({
      ok: false,
      error: 'We could not send your message right now. Please try again shortly or email us directly.',
    });
  }
});

// Catch-all 404 for unknown routes.
app.use((_req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

// Final error handler — never leak stack traces to the client.
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

export default app;
