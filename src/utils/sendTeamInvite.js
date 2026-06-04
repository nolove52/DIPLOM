const INVITE_API_URL = process.env.REACT_APP_INVITE_API_URL || "/api/invite";

export async function sendTeamInvite({ recipientEmail, teamName, captainName, game }) {
  const response = await fetch(INVITE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipientEmail,
      teamName,
      captainName,
      game,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Не удалось отправить приглашение на почту");
  }

  return result;
}
