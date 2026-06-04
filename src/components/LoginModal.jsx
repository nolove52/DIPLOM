import { useState } from "react";

const initialLoginForm = {
  email: "",
  password: "",
};

const initialRegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const result = await onLogin({
      mode,
      ...(isLogin ? loginForm : registerForm),
    });

    if (result && result.ok === false) {
      setError(result.message || "Проверьте введённые данные");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101321] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              VSKturn account
            </p>
            <h2 className="text-2xl font-black">
              {isLogin ? "Вход в аккаунт" : "Регистрация"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
            aria-label="Закрыть окно"
          >
            ×
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => changeMode("login")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              isLogin ? "bg-cyan-400 text-black" : "text-gray-300 hover:text-white"
            }`}
          >
            Войти
          </button>
          <button
            type="button"
            onClick={() => changeMode("register")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              !isLogin ? "bg-cyan-400 text-black" : "text-gray-300 hover:text-white"
            }`}
          >
            Создать аккаунт
          </button>
        </div>

        <div className="grid gap-4">
          {!isLogin && (
            <input
              value={registerForm.name}
              onChange={(event) =>
                setRegisterForm({ ...registerForm, name: event.target.value })
              }
              required
              minLength={2}
              type="text"
              placeholder="Ваше имя"
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
            />
          )}

          <input
            value={isLogin ? loginForm.email : registerForm.email}
            onChange={(event) =>
              isLogin
                ? setLoginForm({ ...loginForm, email: event.target.value })
                : setRegisterForm({ ...registerForm, email: event.target.value })
            }
            required
            type="email"
            placeholder="Email"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <input
            value={isLogin ? loginForm.password : registerForm.password}
            onChange={(event) =>
              isLogin
                ? setLoginForm({ ...loginForm, password: event.target.value })
                : setRegisterForm({ ...registerForm, password: event.target.value })
            }
            required
            minLength={4}
            type="password"
            placeholder="Пароль"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
          />

          {!isLogin && (
            <input
              value={registerForm.confirmPassword}
              onChange={(event) =>
                setRegisterForm({
                  ...registerForm,
                  confirmPassword: event.target.value,
                })
              }
              required
              minLength={4}
              type="password"
              placeholder="Повторите пароль"
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
            />
          )}

          {error && (
            <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400">
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginModal;
