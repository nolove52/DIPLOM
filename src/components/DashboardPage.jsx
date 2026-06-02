import { useState } from "react";
import StatusBadge from "./StatusBadge";

function DashboardPage({
  user,
  teams,
  applications,
  onBackToSite,
  onCreateTeam,
  onInviteToTeam,
  onAcceptInvite,
  onDeclineInvite,
  onDeleteTeam,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const myTeams = teams.filter((team) =>
    team.members.some((member) => member.email === user.email)
  );

  const invitedTeams = teams.filter((team) =>
    team.invitedEmails.includes(user.email)
  );

  const myApplications = applications.filter(
    (application) => application.userEmail === user.email
  );

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-8">
          <button
            onClick={onBackToSite}
            className="mb-6 rounded-xl border border-cyan-400/50 px-5 py-3 font-bold text-cyan-200 transition hover:bg-cyan-500/10"
          >
            ← Вернуться на сайт
          </button>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
                Personal account
              </p>

              <h1 className="mb-4 text-4xl font-black md:text-5xl">
                Личный кабинет VSKturn
              </h1>

              <p className="max-w-3xl text-gray-300">
                Здесь пользователь управляет командами, принимает приглашения и
                отслеживает заявки на турниры.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <p className="text-gray-400">Пользователь</p>
              <h2 className="text-2xl font-black">{user.name}</h2>
              <p className="text-cyan-300">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <DashboardStat title="Мои команды" value={myTeams.length} />
          <DashboardStat title="Приглашения" value={invitedTeams.length} />
          <DashboardStat title="Мои заявки" value={myApplications.length} />
          <DashboardStat
            title="Принято"
            value={
              myApplications.filter((item) => item.status === "Принята").length
            }
          />
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Обзор
          </TabButton>

          <TabButton
            active={activeTab === "teams"}
            onClick={() => setActiveTab("teams")}
          >
            Команды
          </TabButton>

          <TabButton
            active={activeTab === "invites"}
            onClick={() => setActiveTab("invites")}
          >
            Приглашения
          </TabButton>

          <TabButton
            active={activeTab === "applications"}
            onClick={() => setActiveTab("applications")}
          >
            Заявки
          </TabButton>
        </div>

        {activeTab === "overview" && (
          <OverviewTab
            user={user}
            myTeams={myTeams}
            invitedTeams={invitedTeams}
            myApplications={myApplications}
            onChangeTab={setActiveTab}
          />
        )}

        {activeTab === "teams" && (
          <TeamsTab
            user={user}
            myTeams={myTeams}
            onCreateTeam={onCreateTeam}
            onInviteToTeam={onInviteToTeam}
            onDeleteTeam={onDeleteTeam}
          />
        )}

        {activeTab === "invites" && (
          <InvitesTab
            invitedTeams={invitedTeams}
            onAcceptInvite={onAcceptInvite}
            onDeclineInvite={onDeclineInvite}
          />
        )}

        {activeTab === "applications" && (
          <ApplicationsTab myApplications={myApplications} />
        )}
      </div>
    </section>
  );
}

function DashboardStat({ title, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <p className="mb-2 text-gray-400">{title}</p>
      <p className="text-4xl font-black text-cyan-300">{value}</p>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-5 py-3 font-bold transition ${
        active
          ? "bg-cyan-500 text-black"
          : "border border-white/10 bg-black/30 text-gray-300 hover:border-cyan-400"
      }`}
    >
      {children}
    </button>
  );
}

function OverviewTab({ user, myTeams, invitedTeams, myApplications, onChangeTab }) {
  const lastApplications = myApplications.slice(-3).reverse();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
        <h3 className="mb-4 text-2xl font-black">Профиль</h3>

        <div className="grid gap-4">
          <InfoRow label="Имя" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Роль" value={user.role === "admin" ? "Администратор" : "Пользователь"} />
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
        <h3 className="mb-4 text-2xl font-black">Быстрые действия</h3>

        <div className="grid gap-3">
          <button
            onClick={() => onChangeTab("teams")}
            className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-black transition hover:bg-cyan-400"
          >
            Создать или открыть команду
          </button>

          <button
            onClick={() => onChangeTab("invites")}
            className="rounded-xl border border-yellow-400/50 px-5 py-3 font-bold text-yellow-200 transition hover:bg-yellow-500/10"
          >
            Посмотреть приглашения: {invitedTeams.length}
          </button>

          <button
            onClick={() => onChangeTab("applications")}
            className="rounded-xl border border-white/10 px-5 py-3 font-bold text-gray-300 transition hover:border-cyan-400"
          >
            Мои заявки: {myApplications.length}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
        <h3 className="mb-4 text-2xl font-black">Мои команды</h3>

        {myTeams.length === 0 ? (
          <p className="text-gray-400">Вы пока не состоите ни в одной команде.</p>
        ) : (
          <div className="grid gap-3">
            {myTeams.slice(0, 3).map((team) => (
              <div key={team.id} className="rounded-2xl bg-white/[0.04] p-4">
                <p className="font-bold">{team.name}</p>
                <p className="text-sm text-gray-400">
                  {team.game} · участников: {team.members.length}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
        <h3 className="mb-4 text-2xl font-black">Последние заявки</h3>

        {lastApplications.length === 0 ? (
          <p className="text-gray-400">Заявок пока нет.</p>
        ) : (
          <div className="grid gap-3">
            {lastApplications.map((application) => (
              <div key={application.id} className="rounded-2xl bg-white/[0.04] p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">{application.tournamentTitle}</p>
                  <StatusBadge status={application.status} />
                </div>
                <p className="text-sm text-gray-400">
                  Команда: {application.teamName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TeamsTab({ user, myTeams, onCreateTeam, onInviteToTeam, onDeleteTeam }) {
  return (
    <div className="grid gap-8">
      <CreateTeamForm onCreateTeam={onCreateTeam} />

      <div>
        <h3 className="mb-5 text-2xl font-black">Мои команды</h3>

        {myTeams.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-gray-400">
            Вы пока не состоите ни в одной команде.
          </div>
        ) : (
          <div className="grid gap-5">
            {myTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                user={user}
                onInviteToTeam={onInviteToTeam}
                onDeleteTeam={onDeleteTeam}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InvitesTab({ invitedTeams, onAcceptInvite, onDeclineInvite }) {
  if (invitedTeams.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-gray-400">
        Активных приглашений пока нет.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {invitedTeams.map((team) => (
        <div
          key={team.id}
          className="rounded-3xl border border-yellow-400/30 bg-yellow-500/10 p-6"
        >
          <p className="mb-2 text-sm font-bold uppercase text-yellow-300">
            Приглашение
          </p>

          <h4 className="mb-2 text-2xl font-black">{team.name}</h4>

          <p className="mb-4 text-gray-300">
            Игра: {team.game} · Капитан: {team.captainName}
          </p>

          {team.description && (
            <p className="mb-5 leading-7 text-gray-300">{team.description}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onAcceptInvite(team.id)}
              className="rounded-xl bg-green-500 px-5 py-3 font-bold text-black transition hover:bg-green-400"
            >
              Принять
            </button>

            <button
              onClick={() => onDeclineInvite(team.id)}
              className="rounded-xl border border-red-400/50 px-5 py-3 font-bold text-red-300 transition hover:bg-red-500/10"
            >
              Отклонить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsTab({ myApplications }) {
  if (myApplications.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-gray-400">
        У вас пока нет заявок на турниры.
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {myApplications.map((application) => (
        <div
          key={application.id}
          className="rounded-3xl border border-white/10 bg-black/30 p-6"
        >
          <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <p className="mb-2 text-sm font-bold uppercase text-cyan-400">
                {application.game}
              </p>
              <h3 className="text-2xl font-black">
                {application.tournamentTitle}
              </h3>
              <p className="text-gray-400">
                Дата заявки: {application.createdAt}
              </p>
            </div>

            <StatusBadge status={application.status} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoRow label="Команда" value={application.teamName} />
            <InfoRow label="Капитан" value={application.captainName} />
            <InfoRow label="Телефон" value={application.phone} />
            <InfoRow label="Email" value={application.userEmail} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CreateTeamForm({ onCreateTeam }) {
  const [form, setForm] = useState({
    name: "",
    game: "",
    description: "",
    inviteEmails: "",
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onCreateTeam(form);

    setForm({
      name: "",
      game: "",
      description: "",
      inviteEmails: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-3xl border border-white/10 bg-black/30 p-6"
    >
      <div>
        <h3 className="mb-2 text-2xl font-black">Создать команду</h3>
        <p className="text-gray-400">
          Капитан может создать команду и пригласить игроков по email.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          type="text"
          placeholder="Название команды"
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <input
          name="game"
          value={form.game}
          onChange={handleChange}
          required
          type="text"
          placeholder="Дисциплина"
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
        />
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows="3"
        placeholder="Описание команды"
        className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
      />

      <textarea
        name="inviteEmails"
        value={form.inviteEmails}
        onChange={handleChange}
        rows="3"
        placeholder="Email игроков для приглашения"
        className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
      />

      <button className="w-fit rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400">
        Создать команду
      </button>
    </form>
  );
}

function TeamCard({ team, user, onInviteToTeam, onDeleteTeam }) {
  const [emails, setEmails] = useState("");
  const isCaptain = team.captainEmail === user.email;

  function handleInvite(event) {
    event.preventDefault();
    onInviteToTeam(team.id, emails);
    setEmails("");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="mb-2 text-sm font-bold uppercase text-cyan-400">
            {team.game}
          </p>
          <h4 className="text-2xl font-black">{team.name}</h4>
          <p className="text-gray-400">
            Капитан: {team.captainName} · Создана: {team.createdAt}
          </p>
        </div>

        {isCaptain && (
          <button
            onClick={() => onDeleteTeam(team.id)}
            className="w-fit rounded-xl border border-red-400/50 px-4 py-2 font-bold text-red-300 transition hover:bg-red-500/10"
          >
            Удалить
          </button>
        )}
      </div>

      {team.description && (
        <p className="mb-6 leading-7 text-gray-300">{team.description}</p>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 font-bold text-gray-200">Участники</p>
          <div className="grid gap-2">
            {team.members.map((member) => (
              <div
                key={member.email}
                className="rounded-xl bg-black/30 px-4 py-3 text-sm"
              >
                <p className="font-bold">{member.name}</p>
                <p className="text-gray-400">
                  {member.email} · {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 font-bold text-gray-200">Приглашены</p>

          {team.invitedEmails.length === 0 ? (
            <p className="text-gray-500">Активных приглашений нет.</p>
          ) : (
            <div className="grid gap-2">
              {team.invitedEmails.map((email) => (
                <div
                  key={email}
                  className="rounded-xl bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200"
                >
                  {email}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isCaptain && (
        <form onSubmit={handleInvite} className="flex flex-col gap-3 md:flex-row">
          <input
            value={emails}
            onChange={(event) => setEmails(event.target.value)}
            required
            type="text"
            placeholder="Email игроков для приглашения"
            className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <button className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400">
            Пригласить
          </button>
        </form>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-200">{value || "—"}</p>
    </div>
  );
}

export default DashboardPage;
