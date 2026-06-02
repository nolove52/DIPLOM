const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function sendEmail(payload) {
  const response = await fetch(`${API_URL}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Не удалось отправить письмо");
  }

  return data;
}
