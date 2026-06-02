function normalizeTeams(teams = [], size = 8) {
  const list = Array.isArray(teams) ? teams.slice(0, size) : [];
  while (list.length < size) list.push("TBD");
  return list;
}

function buildBracket(teams = []) {
  const list = normalizeTeams(teams);
  return [
    { title: "1/4 финала", label: "Round 1", matches: [
      { id: 1, teams: [list[0], list[1]] },
      { id: 2, teams: [list[2], list[3]] },
      { id: 3, teams: [list[4], list[5]] },
      { id: 4, teams: [list[6], list[7]] },
    ]},
    { title: "1/2 финала", label: "Round 2", matches: [
      { id: 5, teams: ["Победитель 1", "Победитель 2"] },
      { id: 6, teams: ["Победитель 3", "Победитель 4"] },
    ]},
    { title: "Финал", label: "Final", matches: [
      { id: 7, teams: ["Победитель 5", "Победитель 6"] },
    ]},
    { title: "Чемпион", label: "Winner", matches: [
      { id: 8, teams: ["Победитель финала"] },
    ]},
  ];
}

const CARD_W = 270;
const CARD_H = 116;
const COL_X = [0, 310, 620, 930];
const TOPS = [
  [0, 150, 300, 450],
  [75, 375],
  [225],
  [225],
];
const BOARD_W = 1200;
const BOARD_H = 566;

const centerY = (roundIndex, matchIndex) => TOPS[roundIndex][matchIndex] + CARD_H / 2;

function MatchCard({ match, champion = false }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-xl ${champion ? "border-amber-300/70 bg-amber-300/10" : "border-cyan-400/35 bg-[#070b1a]"}`}
      style={{ height: CARD_H }}
    >
      <div className="flex h-8 items-center justify-between px-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
        <span>Матч {match.id}</span>
        <span>{champion ? "WIN" : "BO3"}</span>
      </div>
      <div className="space-y-2 px-3 pb-3">
        {match.teams.map((team, i) => (
          <div
            key={`${match.id}-${team}-${i}`}
            className="flex h-8 min-w-0 items-center rounded-xl bg-white/[0.07] px-3 text-sm font-black leading-none text-slate-100"
          >
            <span className="block truncate">{team}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BracketLines() {
  const pairs = [
    { fromCol: 0, toCol: 1, from: [0, 1], to: 0 },
    { fromCol: 0, toCol: 1, from: [2, 3], to: 1 },
    { fromCol: 1, toCol: 2, from: [0, 1], to: 0 },
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={BOARD_W}
      height={BOARD_H}
      viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="rgba(34,211,238,.95)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" shapeRendering="crispEdges">
        {pairs.map((pair, index) => {
          const xFrom = COL_X[pair.fromCol] + CARD_W;
          const xTo = COL_X[pair.toCol];
          const xMid = xFrom + Math.round((xTo - xFrom) / 2);
          const yA = centerY(pair.fromCol, pair.from[0]);
          const yB = centerY(pair.fromCol, pair.from[1]);
          const yTo = centerY(pair.toCol, pair.to);
          return (
            <path
              key={index}
              d={`M ${xFrom} ${yA} H ${xMid} V ${yB} H ${xFrom} M ${xMid} ${yTo} H ${xTo}`}
            />
          );
        })}
        <path d={`M ${COL_X[2] + CARD_W} ${centerY(2, 0)} H ${COL_X[3]}`} />
      </g>
    </svg>
  );
}

function RoundHeader({ round }) {
  return (
    <div className="h-[70px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">{round.label}</p>
      <h5 className="mt-1 font-black text-white">{round.title}</h5>
    </div>
  );
}

function TournamentBracket({ teams = [], title = "Турнирная сетка", subtitle = "Сетка на 8 участников: четвертьфиналы, полуфиналы, финал и победитель.", onClose }) {
  const rounds = buildBracket(teams);

  return (
    <div className="rounded-[2rem] border border-cyan-500/25 bg-[#07111f] p-5 shadow-2xl shadow-cyan-950/30 sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Play-off bracket 2026</p>
          <h4 className="text-2xl font-black text-white">{title}</h4>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-bold text-cyan-200">8 команд</span>
          {onClose && <button type="button" onClick={onClose} className="rounded-full border border-red-400/40 bg-red-500/10 px-5 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/20">Закрыть сетку</button>}
        </div>
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-[270px_270px_270px_270px] gap-x-10">
            {rounds.map((round) => <RoundHeader key={round.title} round={round} />)}
          </div>
          <div className="relative mt-7" style={{ width: BOARD_W, height: BOARD_H }}>
            <BracketLines />
            {rounds.map((round, ri) => (
              <div key={round.title} className="absolute top-0" style={{ left: COL_X[ri], width: CARD_W }}>
                {round.matches.map((match, mi) => (
                  <div key={match.id} className="absolute w-full" style={{ top: TOPS[ri][mi] }}>
                    <MatchCard match={match} champion={ri === 3} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TournamentBracket;
