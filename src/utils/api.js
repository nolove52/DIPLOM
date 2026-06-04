const API_URL = process.env.REACT_APP_API_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || data.error || "Ошибка сервера");
  }

  return data;
}

export async function registerUser(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveApplication(payload) {
  return request("/api/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveContact(payload) {
  return request("/api/contacts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveTeam(payload) {
  return request("/api/teams", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTeam(payload) {
  return request(`/api/teams/${payload.id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function saveTournament(payload) {
  return request("/api/tournaments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateApplicationStatus(applicationId, status) {
  return request(`/api/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
