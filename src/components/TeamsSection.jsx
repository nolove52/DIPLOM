const bannerImages = [
  "/generated/team-banner-01.png",
  "/generated/team-banner-02.png",
  "/generated/team-banner-03.png",
  "/generated/team-banner-04.png",
  "/generated/team-banner-05.png",
  "/generated/team-banner-06.png",
  "/generated/team-banner-07.png",
  "/generated/team-banner-08.png",
  "/generated/team-banner-09.png",
  "/generated/team-banner-10.png",
  "/generated/team-banner-11.png",
  "/generated/team-banner-12.png",
];

const twitchLinks = [
  "https://www.twitch.tv/pan1x_t0p",
  "https://www.twitch.tv/sanelabsenjoyer",
];

const demoTeams = [
  ["Neon Wolves", "Counter-Strike 2", "Зарегистрирована", "15.06.2026", "Слот подтверждён, игроки прошли чек-ин", 5, 0],
  ["Turtle Control", "Mobile Legends", "В эфире", "сейчас", "Играют верхнюю сетку против Legend Five", 5, 1, twitchLinks[0]],
  ["Aegis Squad", "Dota 2", "Зарегистрирована", "22.06.2026", "Капитан загрузил ростер и запасного игрока", 5, 2],
  ["Spike Rush", "Valorant", "Активна", "30.06.2026", "Тренировки по средам, открыты к спаррингам", 5, 3],
  ["Turbo Boost", "Rocket League", "Активна", "04.08.2026", "Состав обновлён после летней квалификации", 3, 4],
  ["Iron Fist", "Tekken 8", "Активна", "29.09.2026", "Игрок в топе локального рейтинга файтингов", 1, 5],
  ["Legend Five", "Mobile Legends", "Зарегистрирована", "10.06.2026", "Опытный состав, претендент на финал", 5, 6],
  ["Gold Lane", "Mobile Legends", "В эфире", "сейчас", "Вторая карта BO3 в малом финале", 5, 7, twitchLinks[1]],
  ["Mid Core", "Mobile Legends", "Активна", "18.07.2026", "Сильная мид-линия и быстрые ротации", 5, 8],
  ["Crystal Push", "Mobile Legends", "Активна", "26.08.2026", "Любят позднюю игру и камбэки", 5, 9],
  ["Mythic Team", "Mobile Legends", "Зарегистрирована", "02.09.2026", "Закрыли регистрацию полным составом", 5, 10],
];

function getBannerId(team) {
  if (typeof team.bannerId === "number") return team.bannerId % bannerImages.length;
  const hash = [...(team.name || "VSK")].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return hash % bannerImages.length;
}

function TeamsSection({ user, teams = [], onLoginClick, onAcceptInvite, onDeclineInvite }) {
  const userEmail = user?.email;
  const invitedTeams = user ? teams.filter((team) => team.invitedEmails?.includes(userEmail)) : [];

  const createdTeams = teams.map((team) => [
    team.name,
    team.game,
    "Зарегистрирована",
    "сезон 2026",
    `Капитан: ${team.captainName}. Команда добавлена через личный кабинет`,
    team.members?.length || 1,
    getBannerId(team),
  ]);

  const allTeams = [...demoTeams, ...createdTeams];
  const liveTeams = allTeams.filter((team) => team[2] === "В эфире");
  const registeredTeams = allTeams.filter((team) => team[2] === "Зарегистрирована");

  return (
    <section id="teams" className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">Team hub</p>
            <h2 className="mb-4 text-3xl font-black md:text-4xl">Команды турнира</h2>
            <p className="max-w-3xl text-gray-400">
              Зарегистрированные команды, эфирные составы и активные команды сезона. Баннеры разные, без белых конусов; новые команды получают случайный баннер автоматически.
            </p>
          </div>
          <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            Всего команд: {allTeams.length}
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Stat label="Зарегистрированы" value={registeredTeams.length} />
          <Stat label="Сейчас в эфире" value={liveTeams.length} />
          <Stat label="За 6 месяцев" value={allTeams.length} />
        </div>

        {liveTeams.length > 0 && <TeamBlock title="В эфире" teams={liveTeams} live />}
        <TeamBlock title="Зарегистрированы на турнир" teams={registeredTeams} />
        <TeamBlock title="Все существующие команды сезона" teams={allTeams} />

        {!user && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-6">
            <h3 className="mb-2 text-2xl font-black">Хотите добавить свой состав?</h3>
            <p className="mb-5 text-gray-400">Войдите в аккаунт, создайте команду и пригласите игроков по email. Новая команда автоматически получит случайный уникальный баннер.</p>
            <button onClick={onLoginClick} className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black">Войти</button>
          </div>
        )}

        {invitedTeams.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-5 text-2xl font-black">Приглашения</h3>
            {invitedTeams.map((team) => (
              <div key={team.id} className="mb-3 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-5">
                <b>{team.name}</b>
                <div className="mt-3 flex gap-3">
                  <button onClick={() => onAcceptInvite(team.id)} className="rounded-xl bg-green-500 px-4 py-2 font-bold text-black">Принять</button>
                  <button onClick={() => onDeclineInvite(team.id)} className="rounded-xl border border-red-400 px-4 py-2 font-bold text-red-200">Отклонить</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <p className="text-gray-400">{label}</p>
      <p className="text-4xl font-black text-cyan-300">{value}</p>
    </div>
  );
}

function TeamBlock({ title, teams, live }) {
  return (
    <div className="mb-10">
      <h3 className="mb-5 text-2xl font-black">{title}</h3>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => (
          <TeamCard key={`${title}-${team[0]}-${team[1]}`} team={team} live={live || team[2] === "В эфире"} />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ team, live }) {
  const [name, game, status, date, note, members, bannerId, twitchUrl] = team;
  const banner = bannerImages[bannerId % bannerImages.length];

  return (
    <article className="team-card overflow-hidden rounded-3xl border border-white/10 bg-black/30">
      <div className="relative h-44 overflow-hidden">
        <img src={banner} alt={`${name} banner`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/35" />
        <div className="absolute inset-0 border border-white/10" />
        <div className="absolute left-5 top-5">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100">{game}</p>
          <h4 className="max-w-[76%] text-3xl font-black uppercase leading-none tracking-wide text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.55)]">{name}</h4>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${live ? "bg-red-500/20 text-red-200" : "bg-cyan-500/10 text-cyan-200"}`}>{status}</span>
          <span className="text-sm text-gray-400">{date}</span>
        </div>
        <p className="text-gray-300">{note}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-400">
          <p>Участников: <b className="text-white">{members}</b></p>
          <p>Формат: <b className="text-white">LAN</b></p>
        </div>
        {live && twitchUrl && (
          <a
            href={twitchUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 px-5 py-3 font-black text-white"
          >
            Открыть Twitch →
          </a>
        )}
      </div>
    </article>
  );
}

export default TeamsSection;
