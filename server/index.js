import http from "node:http";
import tls from "node:tls";
import net from "node:net";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

loadEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 5000);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const rows = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const row of rows) {
    const line = row.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function getCorsOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return CLIENT_URL;
  if (origin === CLIENT_URL || origin === "http://localhost:3000" || origin === "http://127.0.0.1:3000") {
    return origin;
  }
  return CLIENT_URL;
}

function sendJson(req, res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": getCorsOrigin(req),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload, null, 2));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        req.destroy();
        reject(new Error("Слишком большой запрос"));
      }
    });

    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Некорректный JSON"));
      }
    });

    req.on("error", reject);
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripTags(value = "") {
  return String(value).replace(/<[^>]*>/g, "");
}

function buildHtml({ title, message, details = [] }) {
  const rows = details
    .filter((item) => item?.label && item?.value)
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;color:#64748b;border-bottom:1px solid #e2e8f0;">${escapeHtml(item.label)}</td>
          <td style="padding:10px 12px;color:#0f172a;border-bottom:1px solid #e2e8f0;font-weight:600;">${escapeHtml(item.value)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="padding:24px;background:#07111f;color:#ffffff;">
          <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#22d3ee;font-weight:700;">VSKturn 2026</div>
          <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:24px;">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:#334155;white-space:pre-line;">${escapeHtml(message)}</p>
          ${rows ? `<table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:16px;overflow:hidden;">${rows}</table>` : ""}
          <p style="margin:22px 0 0;font-size:13px;color:#64748b;">Это автоматическое письмо с сайта VSKturn 2026.</p>
        </div>
      </div>
    </div>`;
}

function encodeBase64(value) {
  return Buffer.from(String(value), "utf8").toString("base64");
}

function encodeSubject(value) {
  return `=?UTF-8?B?${encodeBase64(value)}?=`;
}

function makeBoundary() {
  return `vskturn-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildMimeMessage({ from, to, subject, text, html }) {
  const boundary = makeBoundary();
  const safeText = stripTags(text || "");

  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    safeText,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

function looksLikePlaceholder(value = "") {
  const text = String(value).toLowerCase();
  return (
    !text ||
    text.includes("встав") ||
    text.includes("пароль_для") ||
    text.includes("your_") ||
    text.includes("example") ||
    text.includes("password")
  );
}

function assertMailSettings() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Не заполнены SMTP-настройки: ${missing.join(", ")}`);
  }

  if (looksLikePlaceholder(process.env.SMTP_PASS)) {
    throw new Error("В server/.env нужно заменить SMTP_PASS на реальный пароль внешнего приложения Mail.ru/Gmail. Придуманный пароль не сработает.");
  }

  if (!emailRegExp.test(String(process.env.SMTP_USER).trim())) {
    throw new Error("SMTP_USER должен быть настоящей почтой-отправителем");
  }
}

function createSocket() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  return secure
    ? tls.connect({ host, port, servername: host, rejectUnauthorized: true })
    : net.connect({ host, port });
}

function waitForSecureConnect(socket) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("TLS timeout. Проверьте SMTP_PORT/SMTP_SECURE или попробуйте другой интернет."));
    }, 20000);

    function cleanup() {
      clearTimeout(timeout);
      socket.off("secureConnect", onSecureConnect);
      socket.off("error", onError);
    }

    function onSecureConnect() {
      cleanup();
      resolve();
    }

    function onError(error) {
      cleanup();
      reject(error);
    }

    socket.on("secureConnect", onSecureConnect);
    socket.on("error", onError);
  });
}

async function sendSmtpMail({ to, subject, text, html }) {
  assertMailSettings();

  let socket = createSocket();
  const hostName = "localhost";
  const user = String(process.env.SMTP_USER).trim();
  const pass = String(process.env.SMTP_PASS).trim();
  const fromAddress = user;
  const fromHeader = `"VSKturn" <${fromAddress}>`;
  const message = buildMimeMessage({ from: fromHeader, to, subject, text, html });

  let buffer = "";

  function waitForResponse(expectedCodes) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("SMTP timeout. Сервер не ответил. Часто это блокировка SMTP-порта сетью, VPN, антивирусом или провайдером."));
      }, 25000);

      function cleanup() {
        clearTimeout(timeout);
        socket.off("data", onData);
        socket.off("error", onError);
      }

      function onError(error) {
        cleanup();
        reject(error);
      }

      function onData(chunk) {
        buffer += chunk.toString("utf8");
        const lines = buffer.split(/\r?\n/).filter(Boolean);
        const lastLine = lines[lines.length - 1] || "";

        if (/^\d{3} /.test(lastLine)) {
          const code = lastLine.slice(0, 3);
          const fullResponse = buffer;
          buffer = "";
          cleanup();

          if (expectedCodes.includes(code)) {
            resolve(fullResponse);
          } else {
            reject(new Error(`SMTP error ${code}: ${fullResponse}`));
          }
        }
      }

      socket.on("data", onData);
      socket.on("error", onError);
    });
  }

  async function command(value, expectedCodes) {
    socket.write(`${value}\r\n`);
    return waitForResponse(expectedCodes);
  }

  try {
    await waitForResponse(["220"]);
    await command(`EHLO ${hostName}`, ["250"]);

    const secure = String(process.env.SMTP_SECURE || "false") === "true";
    const startTls = String(process.env.SMTP_STARTTLS || "true") === "true";

    if (!secure && startTls) {
      await command("STARTTLS", ["220"]);
      socket = tls.connect({ socket, servername: process.env.SMTP_HOST, rejectUnauthorized: true });
      await waitForSecureConnect(socket);
      buffer = "";
      await command(`EHLO ${hostName}`, ["250"]);
    }

    await command("AUTH LOGIN", ["334"]);
    await command(encodeBase64(user), ["334"]);
    await command(encodeBase64(pass), ["235"]);
    await command(`MAIL FROM:<${fromAddress}>`, ["250"]);
    await command(`RCPT TO:<${to}>`, ["250", "251"]);
    await command("DATA", ["354"]);
    socket.write(`${message}\r\n.\r\n`);
    await waitForResponse(["250"]);
    await command("QUIT", ["221"]);
  } finally {
    socket.end();
  }
}

function checkTcpPort({ host, port }) {
  return new Promise((resolve) => {
    const started = Date.now();
    const socket = net.connect({ host, port: Number(port) });
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve({ host, port: Number(port), ok: false, ms: Date.now() - started, error: "timeout" });
    }, 6000);

    socket.on("connect", () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve({ host, port: Number(port), ok: true, ms: Date.now() - started });
    });

    socket.on("error", (error) => {
      clearTimeout(timeout);
      resolve({ host, port: Number(port), ok: false, ms: Date.now() - started, error: error.message });
    });
  });
}

async function handleSendEmail(req, res) {
  try {
    const body = await readJsonBody(req);
    const { to, subject, message, details = [], adminSubject, adminMessage } = body;

    const cleanTo = String(to || "").trim().toLowerCase();
    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message || "").trim();

    if (!emailRegExp.test(cleanTo)) {
      return sendJson(req, res, 400, { success: false, error: "Некорректный email получателя" });
    }

    if (!cleanSubject || !cleanMessage) {
      return sendJson(req, res, 400, { success: false, error: "Заполните тему и текст письма" });
    }

    await sendSmtpMail({
      to: cleanTo,
      subject: cleanSubject,
      text: cleanMessage,
      html: buildHtml({ title: cleanSubject, message: cleanMessage, details }),
    });

    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (adminEmail && emailRegExp.test(adminEmail) && adminEmail !== cleanTo) {
      const title = adminSubject || `Новая заявка VSKturn 2026 от ${cleanTo}`;
      const text = adminMessage || `${cleanMessage}\n\nEmail пользователя: ${cleanTo}`;
      await sendSmtpMail({
        to: adminEmail,
        subject: title,
        text,
        html: buildHtml({
          title,
          message: adminMessage || `Поступило новое сообщение от пользователя ${cleanTo}.`,
          details: [{ label: "Email пользователя", value: cleanTo }, ...details],
        }),
      });
    }

    console.log(`Email sent to ${cleanTo}`);
    return sendJson(req, res, 200, { success: true, message: "Письмо отправлено" });
  } catch (error) {
    console.error("Mail error:", error);
    return sendJson(req, res, 500, {
      success: false,
      error: error.message || "Письмо не отправлено",
      hint: "Проверьте server/.env, пароль внешнего приложения и доступность SMTP-портов. Для проверки откройте /api/diagnose.",
    });
  }
}

async function handleDiagnose(req, res) {
  const host = process.env.SMTP_HOST || "smtp.mail.ru";
  const port = Number(process.env.SMTP_PORT || 587);
  const current = await checkTcpPort({ host, port });
  const mailRu587 = await checkTcpPort({ host: "smtp.mail.ru", port: 587 });
  const mailRu465 = await checkTcpPort({ host: "smtp.mail.ru", port: 465 });
  const gmail587 = await checkTcpPort({ host: "smtp.gmail.com", port: 587 });
  const gmail465 = await checkTcpPort({ host: "smtp.gmail.com", port: 465 });

  return sendJson(req, res, 200, {
    success: true,
    settings: {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_SECURE: process.env.SMTP_SECURE,
      SMTP_STARTTLS: process.env.SMTP_STARTTLS,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS_IS_FILLED: Boolean(process.env.SMTP_PASS && !looksLikePlaceholder(process.env.SMTP_PASS)),
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    },
    tcp: { current, mailRu587, mailRu465, gmail587, gmail465 },
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    return sendJson(req, res, 200, { success: true });
  }

  if (req.method === "GET" && req.url === "/api/health") {
    return sendJson(req, res, 200, { success: true, message: "VSKturn mail server is running", port: PORT });
  }

  if (req.method === "GET" && req.url === "/api/diagnose") {
    return handleDiagnose(req, res);
  }

  if (req.method === "POST" && req.url === "/api/send-email") {
    return handleSendEmail(req, res);
  }

  return sendJson(req, res, 404, { success: false, error: "Маршрут не найден" });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Порт ${PORT} уже занят. Остановите старый node.exe или поменяйте PORT в .env.`);
    console.error(`Команда для Windows: netstat -ano | findstr :${PORT}`);
    console.error("Потом: taskkill /PID НОМЕР_PID /F");
  } else {
    console.error("Server error:", error);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`VSKturn mail server started on http://localhost:${PORT}`);
  console.log(`Проверка: http://localhost:${PORT}/api/health`);
  console.log(`Диагностика SMTP: http://localhost:${PORT}/api/diagnose`);
});
