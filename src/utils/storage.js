export function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function parseEmails(value) {
  return value
    .split(/[\n,; ]+/)
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.includes("@"));
}
