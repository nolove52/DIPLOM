import { useState } from "react";

function ApplicationModal({ tournament, userTeams = [], onClose, onSubmit }) {
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    teamName: "",
    captainName: "",
    phone: "",
    players: "",
  });

  function handleChange(event) {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  function handleTeamSelect(event) {
    const teamId = event.target.value;
    setSelectedTeamId(teamId);

    const selectedTeam = userTeams.find((team) => String(team.id) === teamId);

    if (!selectedTeam) {
      setForm((prev) => ({
        ...prev,
        teamName: "",
        players: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      teamName: selectedTeam.name,
      players: selectedTeam.members
        .map((member) => `${member.name} (${member.email})`)
        .join("\n"),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSending(true);

    try {
      await onSubmit(form);
    } catch (submitError) {
      setError(
        submitError.message ||
          "Заявка сохранена, но письмо не отправилось. Проверьте backend и SMTP."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#101321] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Заявка на турнир 2026</h2>

            <p className="text-gray-400">
              {tournament.title} — {tournament.game}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="grid gap-4">
          {userTeams.length > 0 && (
            <select
              value={selectedTeamId}
              onChange={handleTeamSelect}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
            >
              <option className="bg-[#101321]" value="">
                Выбрать мою команду
              </option>
              {userTeams.map((team) => (
                <option key={team.id} className="bg-[#101321]" value={team.id}>
                  {team.name} — {team.game}
                </option>
              ))}
            </select>
          )}

          <input
            name="teamName"
            value={form.teamName}
            onChange={handleChange}
            required
            type="text"
            placeholder="Название команды"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <input
            name="captainName"
            value={form.captainName}
            onChange={handleChange}
            required
            type="text"
            placeholder="Имя капитана"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            type="tel"
            placeholder="Телефон для связи"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <textarea
            name="players"
            value={form.players}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Состав команды / никнеймы игроков"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
          />

          {error && (
            <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          )}

          <button
            disabled={isSending}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400 disabled:cursor-wait disabled:bg-slate-500"
          >
            {isSending ? "Отправляем заявку и письмо..." : "Отправить заявку"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationModal;
