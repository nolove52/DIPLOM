import { useEffect, useMemo, useState } from "react";

function Hero({ onNavigate }) {
  const slides = useMemo(
    () => [
      {
        badge: "VSKTURN 2026",
        tag: "LAN SEASON",
        title: "Ближайший киберспортивный сезон уже открыт",
        text:
          "Актуальные турниры, команды, билеты для зрителей, правила участия и контакты организаторов — всё собрано в одном месте.",
        cta: "Смотреть турниры",
        ctaPage: "tournaments",
        secondCta: "Зарегистрировать команду",
        secondPage: "teams",
        stats: [
          ["8", "команд в сетке"],
          ["BO3", "формат матчей"],
          ["LIVE", "эфиры команд"],
        ],
      },
      {
        badge: "CS2 ARENA",
        tag: "ТУРНИРЫ CS2",
        title: "Открытые сетки для команд CS2",
        text:
          "Собирай пятёрку, проходи регистрацию и выходи в плей-офф с понятным расписанием матчей.",
        cta: "Открыть CS2",
        ctaPage: "tournaments",
        secondCta: "Команды CS2",
        secondPage: "teams",
        stats: [
          ["5×5", "основной формат"],
          ["MR12", "регламент карт"],
          ["PRO", "турнирная сетка"],
        ],
      },
      {
        badge: "DOTA CLASH",
        tag: "DOTA 2",
        title: "Матчи Dota 2 с BO3 форматом",
        text:
          "Команды, пики, расписание, эфиры и финальные матчи — всё в одном киберспортивном хабе.",
        cta: "Смотреть Dota 2",
        ctaPage: "tournaments",
        secondCta: "Подать состав",
        secondPage: "teams",
        stats: [
          ["BO3", "серии матчей"],
          ["LAN", "финальный этап"],
          ["16", "слотов сезона"],
        ],
      },
      {
        badge: "TEAM HUB",
        tag: "РЕГИСТРАЦИЯ",
        title: "Собери состав и подай заявку",
        text:
          "Капитан регистрирует команду, добавляет игроков и отслеживает заявки прямо в личном кабинете.",
        cta: "Создать команду",
        ctaPage: "teams",
        secondCta: "В кабинет",
        secondPage: "dashboard",
        stats: [
          ["FAST", "быстрая заявка"],
          ["CAP", "роль капитана"],
          ["ID", "профиль игрока"],
        ],
      },
      {
        badge: "LIVE MATCHES",
        tag: "ЭФИРЫ",
        title: "Следи за матчами и эфирами live",
        text:
          "Расписание матчей, форматы BO3, статусы команд и трансляции оформлены в едином неоновом интерфейсе.",
        cta: "Открыть матчи",
        ctaPage: "tournaments",
        secondCta: "Посмотреть команды",
        secondPage: "teams",
        stats: [
          ["24/7", "доступ онлайн"],
          ["LIVE", "прямые эфиры"],
          ["HUD", "удобные статусы"],
        ],
      },
      {
        badge: "LAN FINALS",
        tag: "ФИНАЛЫ",
        title: "LAN-финалы, сетки и команды",
        text:
          "Финальные игры сезона, зрительские билеты, правила участия и контакты организаторов доступны на платформе.",
        cta: "К финалам",
        ctaPage: "tournaments",
        secondCta: "Контакты",
        secondPage: "contacts",
        stats: [
          ["TOP", "лучшие команды"],
          ["LAN", "очная сцена"],
          ["GG", "финал сезона"],
        ],
      },
      {
        badge: "RANKING",
        tag: "РЕЙТИНГ",
        title: "Следи за прогрессом команд сезона",
        text:
          "Турнирные карточки, составы, статусы и результаты помогают быстро понять, кто проходит дальше.",
        cta: "Рейтинг команд",
        ctaPage: "teams",
        secondCta: "Все турниры",
        secondPage: "tournaments",
        stats: [
          ["ELO", "очки сезона"],
          ["MVP", "лучшие игроки"],
          ["WIN", "статистика игр"],
        ],
      },
    ],
    []
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4800);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="px-4 pb-8 pt-5 sm:px-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[#06101d] shadow-[0_28px_100px_rgba(0,0,0,0.42)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.38),transparent_32%),radial-gradient(circle_at_9%_10%,rgba(34,211,238,0.22),transparent_24%),linear-gradient(135deg,rgba(8,13,28,0.98)_0%,rgba(5,13,25,0.96)_52%,rgba(21,5,42,0.92)_100%)]" />
          <div className="absolute right-0 top-0 h-full w-2/3 opacity-70 [background-image:linear-gradient(116deg,transparent_0%,transparent_42%,rgba(34,211,238,0.15)_43%,transparent_44%,transparent_52%,rgba(168,85,247,0.24)_53%,transparent_55%)]" />
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />

          <button
            type="button"
            onClick={prevSlide}
            aria-label="Предыдущий слайд"
            className="hero-slider-arrow hero-slider-arrow-left absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md sm:left-6 sm:h-14 sm:w-14 lg:left-8"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
              <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Следующий слайд"
            className="hero-slider-arrow hero-slider-arrow-right absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md sm:right-6 sm:h-14 sm:w-14 lg:right-8"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="relative flex min-h-[620px] flex-col justify-between px-7 py-9 sm:px-14 lg:px-24 lg:py-16">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.55em] text-cyan-300">
                  {slide.badge}
                </p>
                <div className="mt-3 h-px w-56 bg-gradient-to-r from-cyan-300 via-blue-500 to-fuchsia-500" />
              </div>

              <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-md sm:flex">
                {slides.map((item, index) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Открыть слайд ${index + 1}`}
                    className={`h-3 rounded-full transition-all ${
                      activeSlide === index
                        ? "w-12 bg-gradient-to-r from-cyan-300 to-fuchsia-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]"
                        : "w-3 bg-white/25"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid items-end gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="max-w-4xl">
                <p className="mb-5 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.35em] text-cyan-200">
                  {slide.tag}
                </p>

                <h1 className="text-4xl font-black uppercase leading-[1.02] text-white drop-shadow-2xl md:text-6xl xl:text-7xl">
                  {slide.title}
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-8 text-gray-200 md:text-lg">
                  {slide.text}
                </p>

                <div className="mt-9 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate(slide.ctaPage)}
                    className="rounded-2xl bg-gradient-to-r from-cyan-300 via-blue-500 to-fuchsia-500 px-8 py-4 font-black text-white shadow-[0_0_32px_rgba(168,85,247,0.32)]"
                  >
                    {slide.cta} →
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate(slide.secondPage)}
                    className="rounded-2xl border border-cyan-300/45 bg-black/25 px-8 py-4 font-black text-cyan-100"
                  >
                    {slide.secondCta}
                  </button>
                </div>
              </div>

              <div className="flex min-h-[300px] flex-col justify-between rounded-[2rem] border border-white/10 bg-black/25 p-6 backdrop-blur-md lg:p-8">
                <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-fuchsia-300">
                  {slide.badge}
                </p>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {slide.stats.map(([value, label]) => (
                    <div
                      key={value}
                      className="min-h-[118px] rounded-2xl border border-cyan-300/20 bg-white/[0.06] p-5"
                    >
                      <p className="text-3xl font-black text-white">{value}</p>
                      <p className="mt-2 text-sm text-gray-300">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    key={activeSlide}
                    className="hero-slider-progress h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-500 to-fuchsia-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 sm:hidden">
              {slides.map((item, index) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-3 rounded-full ${
                    activeSlide === index
                      ? "w-12 bg-gradient-to-r from-cyan-300 to-fuchsia-400"
                      : "w-3 bg-white/25"
                  }`}
                  aria-label={`Открыть слайд ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
