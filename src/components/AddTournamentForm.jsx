import { useState } from "react";

function AddTournamentForm({ onAddTournament }) {
  const [form, setForm] = useState({
    title: "",
    game: "",
    date: "",
    prize: "",
    format: "5x5",
    status: "Регистрация открыта",
    description: "",
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    onAddTournament(form);

    setForm({
      title: "",
      game: "",
      date: "",
      prize: "",
      format: "5x5",
      status: "Регистрация открыта",
      description: "",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          type="text"
          placeholder="Название турнира"
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <input
          name="game"
          value={form.game}
          onChange={handleChange}
          required
          type="text"
          placeholder="Игра"
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          type="text"
          placeholder="Дата"
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <input
          name="prize"
          value={form.prize}
          onChange={handleChange}
          required
          type="text"
          placeholder="Призовой фонд"
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <input
          name="format"
          value={form.format}
          onChange={handleChange}
          required
          type="text"
          placeholder="Формат"
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option className="bg-[#101321]" value="Регистрация открыта">
            Регистрация открыта
          </option>
          <option className="bg-[#101321]" value="Скоро">
            Скоро
          </option>
        </select>
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        required
        rows="3"
        placeholder="Описание турнира"
        className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
      />

      <button className="w-fit rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400">
        Добавить турнир
      </button>
    </form>
  );
}

export default AddTournamentForm;
