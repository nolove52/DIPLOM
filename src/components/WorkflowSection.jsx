function WorkflowSection() {
  const steps = [
    {
      title: "Регистрация",
      text: "Пользователь входит в аккаунт и получает доступ к личному кабинету.",
    },
    {
      title: "Команда",
      text: "В кабинете капитан создаёт команду и приглашает игроков по email.",
    },
    {
      title: "Турнир",
      text: "Команда выбирает турнир и отправляет заявку на участие.",
    },
    {
      title: "Администрирование",
      text: "Администратор проверяет заявки, меняет статусы и управляет турнирами.",
    },
  ];

  return (
    <section id="workflow" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-3xl font-black md:text-4xl">
          Как работает VSKturn
        </h2>

        <p className="mb-10 max-w-2xl text-gray-400">
          Сценарий построен так, чтобы пользователь мог открыть личный кабинет,
          создать команду, пригласить участников и быстро подать заявку на турнир.
        </p>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-white/10 bg-black/30 p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-xl font-black text-black">
                {index + 1}
              </div>

              <h3 className="mb-3 text-xl font-black">{step.title}</h3>
              <p className="leading-7 text-gray-400">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkflowSection;
