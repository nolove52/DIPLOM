import { memo, useEffect, useMemo, useRef, useState } from "react";
import StatusBadge from "./StatusBadge";
import TournamentBracket from "./TournamentBracket";

function TournamentsSection({ tournaments = [], onApplicationClick }) {
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("Все");
  const [selectedStatus, setSelectedStatus] = useState("Все");
  const [selectedBracketId, setSelectedBracketId] = useState(null);
  const bracketRef = useRef(null);

  const games = useMemo(
    () => ["Все", ...new Set(tournaments.map((item) => item.game))],
    [tournaments]
  );

  const statuses = useMemo(
    () => ["Все", "Регистрация открыта", "Скоро", "Регистрация закрыта"],
    []
  );

  const filteredTournaments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tournaments.filter((tournament) => {
      const matchesSearch =
        !searchValue ||
        tournament.title.toLowerCase().includes(searchValue) ||
        tournament.game.toLowerCase().includes(searchValue) ||
        tournament.description.toLowerCase().includes(searchValue);

      const matchesGame =
        selectedGame === "Все" || tournament.game === selectedGame;

      const matchesStatus =
        selectedStatus === "Все" || tournament.status === selectedStatus;

      return matchesSearch && matchesGame && matchesStatus;
    });
  }, [search, selectedGame, selectedStatus, tournaments]);

  const selectedTournament = useMemo(
    () => tournaments.find((tournament) => tournament.id === selectedBracketId),
    [selectedBracketId, tournaments]
  );

  useEffect(() => {
    setSelectedBracketId(null);
  }, [search, selectedGame, selectedStatus]);

  useEffect(() => {
    if (!selectedTournament || !bracketRef.current) return;

    const scrollTimer = window.setTimeout(() => {
      bracketRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => window.clearTimeout(scrollTimer);
  }, [selectedTournament]);

  function handleOpenBracket(tournamentId) {
    setSelectedBracketId((currentId) =>
      currentId === tournamentId ? null : tournamentId
    );
  }

  function handleCloseBracket() {
    setSelectedBracketId(null);
  }

  return (
    <section className="bg-white/[0.03] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              Tournament catalog 2026
            </p>
            <h1 className="mb-4 text-4xl font-black md:text-5xl">
              Турниры 2026 и сетки плей-офф
            </h1>

            <p className="max-w-2xl text-gray-400">
              Выберите дисциплину, найдите турнир и откройте аккуратную плей-офф сетку.
              При смене фильтра открытая сетка сбрасывается автоматически.
            </p>
          </div>

          <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            Найдено: {filteredTournaments.length}
          </div>
        </div>

        <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-black/25 p-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="text"
            placeholder="Поиск турнира по названию, игре или описанию..."
            className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none transition focus:border-cyan-400"
          />

          <div className="flex flex-wrap gap-3">
            {games.map((game) => (
              <button
                key={game}
                type="button"
                onClick={() => setSelectedGame(game)}
                className={`rounded-2xl px-5 py-3 font-bold transition ${
                  selectedGame === game
                    ? "bg-cyan-500 text-black"
                    : "border border-white/10 bg-black/30 text-gray-300 hover:border-cyan-400"
                }`}
              >
                {game}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`rounded-2xl px-5 py-3 font-bold transition ${
                  selectedStatus === status
                    ? "bg-purple-500 text-white"
                    : "border border-white/10 bg-black/30 text-gray-300 hover:border-purple-400"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {selectedTournament && (
          <div ref={bracketRef} className="scroll-mt-24 mb-10">
            <TournamentBracket
              teams={selectedTournament.teams}
              title={`Сетка турнира: ${selectedTournament.title}`}
              subtitle={`Игра: ${selectedTournament.game}. При смене фильтра или дисциплины сетка закрывается, чтобы не показывать старый турнир.`}
              onClose={handleCloseBracket}
            />
          </div>
        )}

        {filteredTournaments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
            Турниры не найдены. Попробуйте изменить поисковый запрос.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                isBracketOpen={selectedBracketId === tournament.id}
                onBracketClick={handleOpenBracket}
                onApplicationClick={onApplicationClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const TournamentCard = memo(function TournamentCard({
  tournament,
  isBracketOpen,
  onBracketClick,
  onApplicationClick,
}) {
  const isClosed = tournament.status !== "Регистрация открыта";
  const teamsCount = tournament.teams?.length || 0;

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-black/30 p-5 transition duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/10">
      {tournament.image && (
        <img
          src={tournament.image}
          alt={tournament.title}
          loading="lazy"
          decoding="async"
          className="mb-5 h-44 w-full rounded-2xl object-cover opacity-90"
        />
      )}

      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="rounded-full bg-cyan-500/10 px-4 py-1 text-sm font-bold text-cyan-300">
          {tournament.game}
        </p>

        <StatusBadge status={tournament.status} compact />
      </div>

      <h3 className="mb-3 text-2xl font-black">{tournament.title}</h3>

      <p className="mb-5 min-h-[84px] leading-7 text-gray-400">
        {tournament.description}
      </p>

      <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
        <p>
          Дата: <span className="text-white">{tournament.date}</span>
        </p>
        <p>
          Формат: <span className="text-white">{tournament.format}</span>
        </p>
        <p>
          Призовой фонд: <span className="text-white">{tournament.prize}</span>
        </p>
        <p>
          Команд в сетке: <span className="text-white">{teamsCount || "TBD"}</span>
        </p>
        {tournament.level && (
          <p>
            Уровень: <span className="text-white">{tournament.level}</span>
          </p>
        )}
      </div>

      {teamsCount > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {tournament.teams.slice(0, 4).map((team) => (
            <span
              key={team}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300"
            >
              {team}
            </span>
          ))}
          {teamsCount > 4 && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              +{teamsCount - 4}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto grid gap-3">
        <button
          type="button"
          onClick={() => onBracketClick(tournament.id)}
          className="w-full rounded-xl border border-cyan-400/50 px-5 py-3 font-bold text-cyan-200 transition hover:bg-cyan-500/10"
        >
          {isBracketOpen ? "Закрыть сетку" : "Открыть сетку"}
        </button>

        <button
          type="button"
          disabled={isClosed}
          onClick={() => onApplicationClick(tournament)}
          className={`w-full rounded-xl px-5 py-3 font-bold transition ${
            isClosed
              ? "cursor-not-allowed bg-gray-700 text-gray-400"
              : "bg-cyan-500 text-black hover:bg-cyan-400"
          }`}
        >
          {isClosed ? "Регистрация закрыта" : "Подать заявку"}
        </button>
      </div>
    </article>
  );
});

export default memo(TournamentsSection);
