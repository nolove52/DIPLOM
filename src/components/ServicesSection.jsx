const services = [
  ["🏆", "Организация турниров", "Берём на себя регламент, регистрацию, посев команд, расписание матчей и контроль игровой зоны."],
  ["👥", "Создание команд", "Капитаны создают составы, приглашают игроков по email и отслеживают участие в личном кабинете."],
  ["📨", "Подача заявок", "Команда выбирает турнир, отправляет заявку и видит статус проверки у администратора."],
  ["🎥", "Эфир и хайлайты", "Оверлеи, комментаторы, запись финала и короткие клипы для соцсетей и отчётов."],
  ["🛡️", "Судейство", "Проверка результатов, скриншоты, решение спорных моментов и контроль дисциплины."],
  ["🎮", "LAN-зона", "Настройка столов, проверка ПК, периферии, сети, Discord-каналов и игровых аккаунтов."],
];

const tickets = [
  ["Зритель", "300 ₽", "Вход в зал, свободная зона просмотра, участие в розыгрышах"],
  ["Игрок LAN", "700 ₽", "Игровое место, браслет участника, доступ к разминке"],
  ["Команда 5x5", "3 000 ₽", "Слот команды, техническая проверка, фото баннера состава"],
];

const stages = [
  ["01", "Регистрация", "Пользователь входит в аккаунт, выбирает турнир и знакомится с условиями участия."],
  ["02", "Создание команды", "Капитан создаёт команду, указывает дисциплину и приглашает игроков по email."],
  ["03", "Подача заявки", "Команда отправляет заявку, а система сохраняет данные и отображает статус."],
  ["04", "Проверка состава", "Администратор проверяет игроков, актуальность состава и допускает команду к участию."],
  ["05", "Матчи и сетка", "Команды играют по расписанию, результаты попадают в турнирную сетку."],
  ["06", "Финал и итоги", "Проводится финальный матч, награждение, публикация победителей и фотоотчёт."],
];

function ServicesSection() {
  return (
    <section id="services" className="px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-cyan-500/25 bg-white/[0.03] p-7 md:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
            LAN services
          </p>
          <h2 className="mb-4 text-4xl font-black md:text-5xl">Услуги VSKturn</h2>
          <p className="mb-10 max-w-3xl text-gray-300">
            Мы предоставляем всё необходимое для проведения киберспортивных турниров любого масштаба: от регистрации команд до финальной трансляции и публикации итогов.
          </p>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map(([icon, title, text]) => (
              <ServiceCard key={title} icon={icon} title={title} text={text} />
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-cyan-500/25 bg-cyan-500/[0.05] p-7 md:p-10">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">Прайс на вход</p>
              <h3 className="text-3xl font-black md:text-4xl">Билеты на локальный LAN-турнир</h3>
            </div>
            <span className="w-fit rounded-full border border-yellow-300/40 bg-yellow-300/10 px-5 py-2 text-sm font-bold text-yellow-200">места ограничены</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {tickets.map(([name, price, text]) => (
              <div key={name} className="rounded-3xl border border-white/10 bg-black/35 p-6">
                <h4 className="mb-2 text-xl font-black">{name}</h4>
                <p className="mb-3 text-4xl font-black text-cyan-300">{price}</p>
                <p className="leading-7 text-gray-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-violet-400/25 bg-violet-500/[0.05] p-7 md:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-violet-300">
            tournament workflow
          </p>
          <h3 className="mb-4 text-3xl font-black md:text-4xl">Этапы проведения турнира</h3>
          <p className="mb-10 max-w-3xl leading-7 text-gray-300">
            Раздел «Этапы» перенесён в услуги, чтобы участник сразу видел не только перечень услуг, но и полный путь от регистрации до финала.
          </p>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {stages.map(([number, title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-black/35 p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500 text-xl font-black text-white">
                  {number}
                </div>
                <h4 className="mb-3 text-xl font-black">{title}</h4>
                <p className="leading-7 text-gray-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <h3 className="mb-4 text-2xl font-black">Что входит в LAN-день</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• 10:00 — открытие площадки, регистрация зрителей и команд.</li>
              <li>• 11:00 — брифинг капитанов, проверка сетапов и аккаунтов.</li>
              <li>• 12:00 — групповой этап или четвертьфиналы по расписанию.</li>
              <li>• 17:30 — финальная сетка, эфир и комментаторская студия.</li>
              <li>• 20:30 — награждение, фото команд и публикация результатов.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <h3 className="mb-4 text-2xl font-black">Правила входа</h3>
            <p className="leading-7 text-gray-300">
              Билет действует на один турнирный день. Игрокам нужно прийти минимум за 45 минут до первого матча, взять документ для подтверждения заявки и заранее войти в игровые аккаунты. Зрители получают браслет, место в зоне просмотра и доступ к розыгрышам между матчами.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-2xl">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-black">{title}</h3>
      <p className="leading-7 text-gray-400">{text}</p>
    </div>
  );
}

export default ServicesSection;
