import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "data");
const dbFile = path.join(dataDir, "database.json");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true);
    },
  })
);
app.use(express.json({ limit: "1mb" }));

const initialDb = {
  users: [],
  teams: [],
  applications: [],
  contacts: [],
  tournaments: [],
  emails: [],
};

async function ensureDb() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbFile);
  } catch {
    await fs.writeFile(dbFile, JSON.stringify(initialDb, null, 2), "utf-8");
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbFile, "utf-8");
  return { ...initialDb, ...JSON.parse(raw || "{}") };
}

async function writeDb(db) {
  await ensureDb();
  await fs.writeFile(dbFile, JSON.stringify(db, null, 2), "utf-8");
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
    createdAt: user.createdAt,
  };
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderEmailTemplate({ title, message, details = [] }) {
  const rows = Array.isArray(details)
    ? details
        .filter((item) => item && item.label && item.value)
        .map(
          (item) => `
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;">${escapeHtml(item.label)}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:700;">${escapeHtml(item.value)}</td>
            </tr>`
        )
        .join("")
    : "";

  return `
    <div style="margin:0;padding:24px;background:#020617;font-family:Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #1e293b;">
        <div style="padding:26px;background:linear-gradient(135deg,#020617,#0f172a);color:#ffffff;">
          <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#22d3ee;font-weight:800;">VSKturn</div>
          <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:26px;color:#0f172a;">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.65;white-space:pre-line;color:#334155;">${escapeHtml(message)}</p>
          ${rows ? `<table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:16px;overflow:hidden;">${rows}</table>` : ""}
          <p style="margin:24px 0 0;font-size:13px;color:#64748b;">Это автоматическое письмо с сайта VSKturn.</p>
        </div>
      </div>
    </div>`;
}

function getMailFrom() {
  const sender = process.env.MAIL_FROM || process.env.SMTP_USER;
  return sender || "VSKturn <noreply@vskturn.local>";
}

function assertSmtpReady() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((key) => !String(process.env[key] || "").trim());

  if (missing.length > 0) {
    throw new Error(`SMTP не настроен. Заполните в backend/.env: ${missing.join(", ")}`);
  }

  const pass = String(process.env.SMTP_PASS || "").toLowerCase();
  if (pass.includes("password") || pass.includes("example") || pass.includes("пароль") || pass.includes("встав")) {
    throw new Error("SMTP_PASS должен быть реальным паролем внешнего приложения, а не обычным паролем от почты и не примером из файла.");
  }
}

function createTransporter() {
  assertSmtpReady();

  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || (port === 465 ? "true" : "false")) === "true";
  const requireTLS = String(process.env.SMTP_REQUIRE_TLS || (port === 587 ? "true" : "false")) === "true";

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    requireTLS,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
    tls: {
      minVersion: "TLSv1.2",
      servername: process.env.SMTP_HOST,
    },
  });
}

async function saveEmailLog(emailPayload) {
  const db = await readDb();
  db.emails.unshift({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...emailPayload,
  });
  await writeDb(db);
}

async function sendRealMail({ to, subject, message, text, html, details = [] }) {
  const transporter = createTransporter();
  const plainText = text || `${message || ""}\n\n${Array.isArray(details) ? details.map((item) => `${item.label}: ${item.value}`).join("\n") : ""}`;
  const htmlBody = html || renderEmailTemplate({ title: subject, message: message || text || "", details });

  await transporter.verify();
  const info = await transporter.sendMail({
    from: getMailFrom(),
    to,
    subject,
    text: plainText,
    html: htmlBody,
  });

  await saveEmailLog({
    from: getMailFrom(),
    to,
    subject,
    status: "sent",
    messageId: info.messageId,
  });

  return info;
}

app.get("/", (req, res) => {
  res.json({ ok: true, name: "VSKturn backend", status: "server started" });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "server started" });
});

app.get("/api/state", async (req, res) => {
  const db = await readDb();
  res.json({
    ok: true,
    users: db.users.map(publicUser),
    teams: db.teams,
    applications: db.applications,
    contacts: db.contacts,
    tournaments: db.tournaments,
    emails: db.emails,
  });
});

app.post("/api/auth/register", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");
  const confirmPassword = String(req.body.confirmPassword || "");

  if (name.length < 2) {
    return res.status(400).json({ ok: false, message: "Введите имя не короче 2 символов" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: "Введите корректный email" });
  }

  if (password.length < 4) {
    return res.status(400).json({ ok: false, message: "Пароль должен содержать минимум 4 символа" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ ok: false, message: "Пароли не совпадают" });
  }

  if (email === "admin@vskturn.ru") {
    return res.status(409).json({ ok: false, message: "Этот email зарезервирован для администратора" });
  }

  const db = await readDb();
  const exists = db.users.some((user) => user.email === email);

  if (exists) {
    return res.status(409).json({ ok: false, message: "Пользователь с таким email уже существует" });
  }

  const user = {
    id: Date.now(),
    name,
    email,
    password,
    role: "user",
    createdAt: new Date().toLocaleString("ru-RU"),
  };

  db.users.push(user);
  await writeDb(db);

  res.status(201).json({ ok: true, user: publicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (email === "admin@vskturn.ru" && password === "admin") {
    return res.json({
      ok: true,
      user: {
        id: "admin",
        name: "Администратор",
        email,
        role: "admin",
      },
    });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ ok: false, message: "Неверный email или пароль" });
  }

  res.json({ ok: true, user: publicUser(user) });
});

app.post("/api/applications", async (req, res) => {
  const db = await readDb();
  const application = {
    id: req.body.id || Date.now(),
    createdAt: req.body.createdAt || new Date().toLocaleString("ru-RU"),
    status: req.body.status || "Новая",
    ...req.body,
  };
  db.applications.unshift(application);
  await writeDb(db);
  res.status(201).json({ ok: true, application });
});

app.patch("/api/applications/:id/status", async (req, res) => {
  const db = await readDb();
  const id = Number(req.params.id);
  const status = String(req.body.status || "Новая");
  db.applications = db.applications.map((application) =>
    Number(application.id) === id ? { ...application, status } : application
  );
  await writeDb(db);
  res.json({ ok: true });
});

app.post("/api/contacts", async (req, res) => {
  const db = await readDb();
  const contact = {
    id: req.body.id || Date.now(),
    createdAt: req.body.createdAt || new Date().toLocaleString("ru-RU"),
    ...req.body,
  };
  db.contacts.unshift(contact);
  await writeDb(db);
  res.status(201).json({ ok: true, contact });
});

app.post("/api/teams", async (req, res) => {
  const db = await readDb();
  const team = {
    id: req.body.id || Date.now(),
    createdAt: req.body.createdAt || new Date().toLocaleString("ru-RU"),
    ...req.body,
  };
  db.teams.unshift(team);
  await writeDb(db);
  res.status(201).json({ ok: true, team });
});

app.put("/api/teams/:id", async (req, res) => {
  const db = await readDb();
  const id = Number(req.params.id);
  const team = { ...req.body, id: req.body.id || id };
  const exists = db.teams.some((item) => Number(item.id) === id);
  db.teams = exists
    ? db.teams.map((item) => (Number(item.id) === id ? team : item))
    : [team, ...db.teams];
  await writeDb(db);
  res.json({ ok: true, team });
});

app.post("/api/tournaments", async (req, res) => {
  const db = await readDb();
  const tournament = { id: req.body.id || Date.now(), ...req.body };
  db.tournaments.unshift(tournament);
  await writeDb(db);
  res.status(201).json({ ok: true, tournament });
});

app.post("/api/send-email", async (req, res) => {
  const { to, subject, message, adminSubject, adminMessage, details = [] } = req.body;

  if (!isValidEmail(to || "")) {
    return res.status(400).json({ success: false, error: "Некорректный email получателя" });
  }

  if (!String(subject || "").trim() || !String(message || "").trim()) {
    return res.status(400).json({ success: false, error: "Заполните тему и текст письма" });
  }

  try {
    await sendRealMail({
      to,
      subject: subject || "VSKturn",
      message: message || "",
      details,
    });

    if (process.env.ADMIN_EMAIL && isValidEmail(process.env.ADMIN_EMAIL) && process.env.ADMIN_EMAIL !== to) {
      await sendRealMail({
        to: process.env.ADMIN_EMAIL,
        subject: adminSubject || subject || "VSKturn",
        message: adminMessage || "Новое событие на сайте VSKturn.",
        details: [{ label: "Email пользователя", value: to }, ...details],
      });
    }

    res.json({ success: true, ok: true, message: "Письмо реально отправлено через SMTP" });
  } catch (error) {
    console.error("Ошибка отправки письма:", error);
    await saveEmailLog({ to, subject, status: "error", error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || "Ошибка отправки письма",
      hint: "Проверьте backend/.env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS. Для Mail.ru нужен пароль внешнего приложения.",
    });
  }
});

app.post("/api/invite", async (req, res) => {
  try {
    const { recipientEmail, teamName, captainName, game } = req.body;

    if (!isValidEmail(recipientEmail || "")) {
      return res.status(400).json({ message: "Некорректный email получателя" });
    }

    if (!teamName || !captainName) {
      return res.status(400).json({ message: "Не указано название команды или имя капитана" });
    }

    const subject = `Приглашение в команду ${teamName}`;
    const message = `Здравствуйте!\n\n${captainName} приглашает вас вступить в команду «${teamName}»${game ? ` по дисциплине «${game}»` : ""}.\n\nЧтобы принять приглашение, войдите на сайт VSKturn под этой почтой и откройте раздел «Личный кабинет» → «Приглашения».`;

    await sendRealMail({
      to: recipientEmail,
      subject,
      message,
      details: [
        { label: "Команда", value: teamName },
        { label: "Капитан", value: captainName },
        { label: "Дисциплина", value: game || "Не указана" },
      ],
    });

    return res.json({ ok: true, success: true, message: "Настоящее приглашение отправлено на email" });
  } catch (error) {
    console.error("Ошибка отправки приглашения:", error);
    return res.status(500).json({
      ok: false,
      success: false,
      message: error.message || "Ошибка сервера при отправке письма",
      hint: "Проверьте backend/.env и пароль внешнего приложения SMTP.",
    });
  }
});

app.get("/api/mail/diagnose", async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    res.json({
      ok: true,
      success: true,
      message: "SMTP подключение работает. Сервер готов отправлять настоящие письма.",
      smtpUser: process.env.SMTP_USER,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      success: false,
      message: error.message,
      hint: "Для Mail.ru включите SMTP и создайте пароль внешнего приложения в настройках почты.",
    });
  }
});

app.listen(port, () => {
  console.log(`VSKturn backend started on http://localhost:${port}`);
});
