import StatusBadge from "./StatusBadge";

function ProfileSection({ user, applications, teams }) {
  const userApplications = applications.filter(
    (item) => item.userEmail === user.email
  );

  return (
    <section id="profile" className="bg-white/[0.03] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-3xl font-black">Личный кабинет</h2>

        <p className="mb-8 text-gray-400">
          Здесь отображаются команды пользователя и заявки на участие в турнирах.
        </p>

        <div className="mb-8 rounded-3xl border border-white/10 bg-black/30 p-6">
          <p className="text-gray-400">Пользователь</p>
          <h3 className="text-2xl font-black">{user.name}</h3>
          <p className="text-cyan-300">{user.email}</p>
        </div>

        <div className="mb-10">
          <h3 className="mb-5 text-2xl font-black">Мои команды</h3>

          {teams.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-gray-400">
              Вы пока не состоите ни в одной команде.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <p className="mb-2 text-sm font-bold uppercase text-cyan-400">
                    {team.game}
                  </p>
                  <h4 className="text-xl font-black">{team.name}</h4>
                  <p className="text-gray-400">
                    Участников: {team.members.length}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-5 text-2xl font-black">Мои заявки</h3>

          {userApplications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-gray-400">
              У вас пока нет заявок на турниры.
            </div>
          ) : (
            <div className="grid gap-4">
              {userApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <h3 className="text-xl font-black">
                        {application.tournamentTitle}
                      </h3>
                      <p className="text-gray-400">
                        Команда: {application.teamName}
                      </p>
                    </div>

                    <StatusBadge status={application.status} />
                  </div>

                  <p className="text-sm text-gray-500">
                    Дата заявки: {application.createdAt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;
