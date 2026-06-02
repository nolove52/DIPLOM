import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || "true") === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
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

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: recipientEmail,
      subject: `Приглашение в команду ${teamName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Приглашение в команду VSKturn</h2>
          <p>Здравствуйте!</p>
          <p><b>${captainName}</b> приглашает вас вступить в команду <b>${teamName}</b>${game ? ` по дисциплине <b>${game}</b>` : ""}.</p>
          <p>Чтобы принять приглашение, войдите на сайт VSKturn под этой почтой и откройте раздел «Личный кабинет» → «Приглашения».</p>
          <p style="margin-top: 24px; color: #6b7280;">Это автоматическое письмо, отправленное системой VSKturn.</p>
        </div>
      `,
      text: `${captainName} приглашает вас вступить в команду ${teamName}${game ? ` по дисциплине ${game}` : ""}. Войдите на сайт VSKturn под этой почтой и откройте раздел «Личный кабинет» -> «Приглашения».`,
    });

    return res.json({ message: "Приглашение отправлено" });
  } catch (error) {
    console.error("Ошибка отправки приглашения:", error);
    return res.status(500).json({ message: "Ошибка сервера при отправке письма" });
  }
});

app.listen(port, () => {
  console.log(`Mail backend started on http://localhost:${port}`);
});
