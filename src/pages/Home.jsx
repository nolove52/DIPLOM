import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";

function Home({ teamsCount, tournamentsCount, onNavigate }) {
  const pages = [
    {
      title: "Турниры",
      text: "Каталог соревнований, фильтры по играм и турнирные сетки команд.",
      page: "tournaments",
    },
    {
      title: "Команды",
      text: "Зарегистрированные, эфирные и активные команды сезона.",
      page: "teams",
    },
    {
      title: "Контакты",
      text: "Форма обращения, телефон, email и карта вынесены в отдельную страницу.",
      page: "contacts",
    },
  ];

  return (
    <>
      <Hero onNavigate={onNavigate} />
      <StatsSection teamsCount={teamsCount} />

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.04] p-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              LAN season
            </p>
            <h2 className="mb-4 text-3xl font-black md:text-4xl">
              Ближайший киберспортивный сезон уже открыт
            </h2>
            <p className="max-w-3xl leading-7 text-gray-300">
              На площадке собраны актуальные турниры, команды, билеты для зрителей,
              правила участия и контакты организаторов. Выбирайте дисциплину,
              регистрируйте состав или приходите поддержать игроков на LAN-финал.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onNavigate("tournaments")}
                className="rounded-2xl bg-gradient-to-r from-cyan-300 to-fuchsia-500 px-7 py-3 font-black text-white"
              >
                Смотреть турниры →
              </button>
              <button
                type="button"
                onClick={() => onNavigate("teams")}
                className="rounded-2xl border border-cyan-300/40 bg-black/25 px-7 py-3 font-black text-cyan-100"
              >
                Зарегистрировать команду
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pages.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className="rounded-3xl border border-white/10 bg-black/30 p-6 text-left"
              >
                <h3 className="mb-3 text-2xl font-black">{item.title}</h3>
                <p className="mb-5 leading-7 text-gray-400">{item.text}</p>
                <span className="font-bold text-cyan-300">Открыть страницу →</span>
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <p className="mb-2 text-gray-400">Турниров в базе</p>
              <p className="text-4xl font-black text-cyan-300">{tournamentsCount}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <p className="mb-2 text-gray-400">Демо-команд создано</p>
              <p className="text-4xl font-black text-cyan-300">{teamsCount}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h3 className="mb-3 text-xl font-black">Для игроков</h3><p className="leading-7 text-gray-400">Регистрация состава, чек-ин капитана, расписание матчей, уведомления по сетке и понятные правила замен.</p></div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h3 className="mb-3 text-xl font-black">Для зрителей</h3><p className="leading-7 text-gray-400">Афиша LAN-дня, билеты, зона просмотра, розыгрыши, расписание финалов и список команд в эфире.</p></div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h3 className="mb-3 text-xl font-black">Для организаторов</h3><p className="leading-7 text-gray-400">Админ-панель, заявки, контакты капитанов, турнирные карточки и быстрый вывод сетки на сайт.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
