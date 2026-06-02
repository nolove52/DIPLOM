import { useState } from "react";

function LoginModal({ onClose, onLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    onLogin(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101321] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black">Вход в VSKturn</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="grid gap-4">
          <input
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
            required
            type="text"
            placeholder="Ваше имя"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <input
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            required
            type="email"
            placeholder="Email"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <button className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400">
            Войти
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Для демонстрации дипломного проекта данные сохраняются в localStorage.
        </p>
      </form>
    </div>
  );
}

export default LoginModal;
