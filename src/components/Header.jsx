import { useState } from "react";

function Header({
  user,
  currentPage,
  onNavigate,
  onDashboardClick,
  onLoginClick,
  onLogout,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { id: "home", label: "Главная" },
    { id: "services", label: "Услуги" },
    { id: "tournaments", label: "Турниры" },
    { id: "teams", label: "Команды" },
    { id: "contacts", label: "Контакты" },
  ];

  if (user?.role === "admin") {
    links.push({ id: "admin", label: "Админ" });
  }

  function handleLinkClick(pageId) {
    onNavigate(pageId);
    setIsMenuOpen(false);
  }

  function handleDashboardClick() {
    onDashboardClick();
    setIsMenuOpen(false);
  }

  function getLinkClass(pageId) {
    return currentPage === pageId
      ? "text-cyan-300"
      : "text-gray-300";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-500/20 bg-[#050812]/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => handleLinkClick("home")}
          className="flex items-center gap-3 text-left"
          aria-label="VSKturn — на главную"
        >
          <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/35 bg-cyan-400/10 shadow-lg shadow-cyan-500/20">
            <span className="absolute h-10 w-4 -skew-x-12 rounded bg-cyan-300" />
            <span className="absolute h-10 w-4 skew-x-12 rounded bg-violet-500" />
            <span className="absolute h-3 w-12 -rotate-45 rounded bg-cyan-100/90" />
          </span>
          <span className="leading-none">
            <span className="block text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              VSK<span className="text-cyan-300">turn</span>
            </span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-300/80">
              esports platform
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={getLinkClass(link.id)}
            >
              {link.label}
            </button>
          ))}

          {user && (
            <button
              onClick={handleDashboardClick}
              className={getLinkClass("dashboard")}
            >
              Кабинет
            </button>
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <button
                type="button"
                onClick={handleDashboardClick}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  currentPage === "dashboard"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-gray-300"
                }`}
              >
                {user.name}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-xl border border-red-400/40 px-4 py-2 text-sm font-bold text-red-200"
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-xl border border-cyan-400 px-5 py-2 text-sm font-bold text-cyan-200"
            >
              Войти
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-cyan-200 md:hidden"
        >
          Меню
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#070812] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`${getLinkClass(link.id)} text-left`}
              >
                {link.label}
              </button>
            ))}
            {user && (
              <button onClick={handleDashboardClick} className="text-left text-gray-300">
                Кабинет
              </button>
            )}
            {user ? (
              <button onClick={onLogout} className="text-left text-red-200">
                Выйти
              </button>
            ) : (
              <button onClick={onLoginClick} className="text-left text-cyan-200">
                Войти
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
