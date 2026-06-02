import AddTournamentForm from "./AddTournamentForm";
import AdminStat from "./AdminStat";
import InfoItem from "./InfoItem";
import StatusBadge from "./StatusBadge";

function AdminSection({
  tournaments,
  applications,
  contacts,
  teams,
  onAddTournament,
  onDeleteTournament,
  onUpdateApplicationStatus,
  onDeleteApplication,
  onDeleteContact,
  onResetDemoData,
}) {
  return (
    <section id="admin" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
            VSKturn admin panel
          </p>

          <h2 className="mb-4 text-3xl font-black md:text-4xl">
            Админ-панель
          </h2>

          <p className="max-w-2xl text-gray-400">
            Администратор может создавать турниры, просматривать заявки,
            команды и обращения пользователей.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-5">
          <AdminStat title="Турниры" value={tournaments.length} />
          <AdminStat title="Команды" value={teams.length} />
          <AdminStat title="Всего заявок" value={applications.length} />
          <AdminStat
            title="Новые заявки"
            value={applications.filter((item) => item.status === "Новая").length}
          />
          <AdminStat title="Обращения" value={contacts.length} />
        </div>

        <div className="mb-14 rounded-3xl border border-white/10 bg-black/30 p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-black">Управление турнирами</h3>
              <p className="text-gray-400">
                Добавляйте новые турниры, которые сразу появятся на сайте.
              </p>
            </div>

            <button
              onClick={onResetDemoData}
              className="w-fit rounded-xl border border-red-400/50 px-5 py-3 font-bold text-red-300 transition hover:bg-red-500/10"
            >
              Сбросить демо-данные
            </button>
          </div>

          <AddTournamentForm onAddTournament={onAddTournament} />

          <div className="mt-8 grid gap-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="mb-2 text-sm font-bold uppercase text-cyan-400">
                      {tournament.game}
                    </p>

                    <h4 className="text-xl font-black">{tournament.title}</h4>
                    <p className="text-gray-400">
                      {tournament.date} · {tournament.prize} ·{" "}
                      {tournament.format}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <StatusBadge status={tournament.status} />

                    <button
                      onClick={() => onDeleteTournament(tournament.id)}
                      className="rounded-xl border border-red-400/50 px-4 py-2 font-bold text-red-300 transition hover:bg-red-500/10"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-14">
          <h3 className="mb-6 text-2xl font-black">Команды пользователей</h3>

          {teams.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-gray-400">
              Команд пока нет.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-3xl border border-white/10 bg-black/30 p-6"
                >
                  <p className="mb-2 text-sm font-bold uppercase text-cyan-400">
                    {team.game}
                  </p>
                  <h4 className="text-2xl font-black">{team.name}</h4>
                  <p className="mb-4 text-gray-400">
                    Капитан: {team.captainName} · {team.captainEmail}
                  </p>
                  <p className="text-gray-400">
                    Участников: {team.members.length} · Приглашений:{" "}
                    {team.invitedEmails.length}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-14">
          <h3 className="mb-6 text-2xl font-black">Заявки на турниры</h3>

          {applications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-gray-400">
              Заявок пока нет.
            </div>
          ) : (
            <div className="grid gap-5">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-3xl border border-white/10 bg-black/30 p-6"
                >
                  <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="mb-2 text-sm font-bold uppercase text-cyan-400">
                        {application.game}
                      </p>

                      <h4 className="text-2xl font-black">
                        {application.tournamentTitle}
                      </h4>

                      <p className="text-gray-400">
                        Дата заявки: {application.createdAt}
                      </p>
                    </div>

                    <StatusBadge status={application.status} />
                  </div>

                  <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <InfoItem label="Команда" value={application.teamName} />
                    <InfoItem label="Капитан" value={application.captainName} />
                    <InfoItem label="Телефон" value={application.phone} />
                    <InfoItem label="Email" value={application.userEmail} />
                  </div>

                  <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="mb-2 text-sm text-gray-500">
                      Состав команды:
                    </p>

                    <p className="whitespace-pre-wrap text-gray-300">
                      {application.players}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        onUpdateApplicationStatus(application.id, "Принята")
                      }
                      className="rounded-xl bg-green-500 px-5 py-3 font-bold text-black transition hover:bg-green-400"
                    >
                      Принять
                    </button>

                    <button
                      onClick={() =>
                        onUpdateApplicationStatus(application.id, "Отклонена")
                      }
                      className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-400"
                    >
                      Отклонить
                    </button>

                    <button
                      onClick={() => onDeleteApplication(application.id)}
                      className="rounded-xl border border-white/10 px-5 py-3 font-bold text-gray-300 transition hover:border-red-400 hover:text-red-300"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-6 text-2xl font-black">Обращения пользователей</h3>

          {contacts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-gray-400">
              Обращений пока нет.
            </div>
          ) : (
            <div className="grid gap-5">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-3xl border border-white/10 bg-black/30 p-6"
                >
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <h4 className="text-xl font-black">{contact.name}</h4>
                      <p className="text-cyan-300">{contact.email}</p>
                      <p className="text-sm text-gray-500">
                        {contact.createdAt}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteContact(contact.id)}
                      className="rounded-xl border border-red-400/50 px-4 py-2 font-bold text-red-300 transition hover:bg-red-500/10"
                    >
                      Удалить
                    </button>
                  </div>

                  <p className="whitespace-pre-wrap leading-7 text-gray-300">
                    {contact.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Для входа как администратор используй email: admin@vskturn.ru
        </p>
      </div>
    </section>
  );
}

export default AdminSection;
