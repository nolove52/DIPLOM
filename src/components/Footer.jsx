function Footer() {
  return (
    <footer className="w-full border-t border-cyan-500/25 bg-[#030712] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr_1.1fr_1fr] md:items-start">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 font-black text-cyan-200">VS</span>
              <span className="text-2xl font-black uppercase text-white">VSK<span className="text-cyan-300">turn</span></span>
            </div>
            <p className="text-sm leading-6 text-gray-400">Учебная платформа для киберспортивных LAN-турниров, заявок и команд.</p>
          </div>

          <div>
            <h3 className="mb-3 font-black text-white">Контакты</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>+7 (999) 123-45-67</li>
              <li>info@vskturn.ru</li>
              <li>t.me/vskturn</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-black text-white">Карта</h3>
            <iframe
              title="Карта VSKturn"
              className="h-28 w-full rounded-2xl border border-cyan-300/20"
              src="https://www.openstreetmap.org/export/embed.html?bbox=131.872%2C43.105%2C131.902%2C43.125&layer=mapnik&marker=43.115%2C131.887"
            />
          </div>

          <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-4">
            <h3 className="mb-2 font-black text-cyan-200">Учебный материал</h3>
            <p className="text-sm leading-6 text-gray-300">Сайт создан исключительно в образовательных целях. Контакты и карта демонстрационные.</p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 VSKturn. Учебный проект.</p>
          <p>Владивосток · Информационная система для турниров</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
