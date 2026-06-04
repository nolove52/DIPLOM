import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

import { DEFAULT_TOURNAMENTS } from "./data/defaultTournaments";
import { DEFAULT_TEAMS } from "./data/defaultTeams";
import { loadFromStorage, parseEmails } from "./utils/storage";
import { sendEmail } from "./utils/emailApi";
import { sendTeamInvite } from "./utils/sendTeamInvite";
import {
  loginUser,
  registerUser,
  saveApplication,
  saveContact,
  saveTeam,
  saveTournament,
  updateApplicationStatus,
  updateTeam,
} from "./utils/api";

import Header from "./components/Header";
import DashboardPage from "./components/DashboardPage";
import LoginModal from "./components/LoginModal";
import ApplicationModal from "./components/ApplicationModal";
import Toast from "./components/Toast";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Tournaments from "./pages/Tournaments";
import Teams from "./pages/Teams";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Admin from "./pages/Admin";

function mergeDefaults(savedItems, defaultItems) {
  if (!Array.isArray(savedItems)) {
    return defaultItems;
  }

  const savedById = new Map(savedItems.map((item) => [item.id, item]));
  const defaultIds = new Set(defaultItems.map((item) => item.id));

  const mergedDefaults = defaultItems.map((defaultItem) => {
    const savedItem = savedById.get(defaultItem.id);

    if (!savedItem) {
      return defaultItem;
    }

    return {
      ...defaultItem,
      ...savedItem,
      teams: savedItem.teams || defaultItem.teams,
      image: savedItem.image || defaultItem.image,
      level: savedItem.level || defaultItem.level,
    };
  });

  const customItems = savedItems.filter((item) => !defaultIds.has(item.id));

  return [...mergedDefaults, ...customItems];
}

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const [user, setUser] = useState(() => loadFromStorage("vskturnUser", null));

  const [tournaments, setTournaments] = useState(() =>
    mergeDefaults(loadFromStorage("vskturnTournaments", []), DEFAULT_TOURNAMENTS)
  );

  const [applications, setApplications] = useState(() =>
    loadFromStorage("vskturnApplications", [])
  );

  const [contacts, setContacts] = useState(() =>
    loadFromStorage("vskturnContacts", [])
  );

  const [teams, setTeams] = useState(() =>
    mergeDefaults(loadFromStorage("vskturnTeams", []), DEFAULT_TEAMS)
  );

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEducationNoticeOpen, setIsEducationNoticeOpen] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("vskturnTournaments", JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem("vskturnApplications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("vskturnContacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("vskturnTeams", JSON.stringify(teams));
  }, [teams]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  }, []);

  const navigateTo = useCallback((page = "home") => {
    setCurrentPage(page);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  }, []);

  function openDashboard() {
    if (!user) {
      setIsLoginOpen(true);
      showToast("Сначала войдите в аккаунт");
      return;
    }

    navigateTo("dashboard");
  }

  function getLocalUsers() {
    try {
      return JSON.parse(localStorage.getItem("vskturnUsers") || "[]");
    } catch {
      return [];
    }
  }

  function saveLocalUsers(nextUsers) {
    localStorage.setItem("vskturnUsers", JSON.stringify(nextUsers));
  }

  function finishAuth(newUser, message) {
    localStorage.setItem("vskturnUser", JSON.stringify(newUser));
    setUser(newUser);
    setIsLoginOpen(false);
    showToast(message);
  }

  async function handleLogin(userData) {
    const email = userData.email.trim().toLowerCase();
    const password = userData.password || "";

    if (userData.mode === "register") {
      const name = String(userData.name || "").trim();
      const confirmPassword = userData.confirmPassword || "";

      if (name.length < 2) {
        return { ok: false, message: "Введите имя не короче 2 символов" };
      }

      if (password.length < 4) {
        return { ok: false, message: "Пароль должен содержать минимум 4 символа" };
      }

      if (password !== confirmPassword) {
        return { ok: false, message: "Пароли не совпадают" };
      }

      try {
        const result = await registerUser({
          name,
          email,
          password,
          confirmPassword,
        });

        finishAuth(result.user, "Аккаунт создан, данные сохранены на сервере");
        return { ok: true };
      } catch (error) {
        const localUsers = getLocalUsers();

        if (localUsers.some((item) => item.email === email)) {
          return { ok: false, message: "Пользователь с таким email уже существует" };
        }

        const localUser = {
          id: Date.now(),
          name,
          email,
          password,
          role: email === "admin@vskturn.ru" ? "admin" : "user",
          createdAt: new Date().toLocaleString("ru-RU"),
        };

        saveLocalUsers([localUser, ...localUsers]);
        const { password: _password, ...publicUser } = localUser;
        finishAuth(publicUser, "Аккаунт создан локально. Для сохранения на сервере запустите backend");
        return { ok: true };
      }
    }

    try {
      const result = await loginUser({ email, password });
      finishAuth(result.user, "Вы успешно вошли в аккаунт");
      return { ok: true };
    } catch (error) {
      if (email === "admin@vskturn.ru" && password === "admin") {
        finishAuth(
          { id: "admin", name: "Администратор", email, role: "admin" },
          "Вы вошли как администратор"
        );
        return { ok: true };
      }

      const localUser = getLocalUsers().find(
        (item) => item.email === email && item.password === password
      );

      if (localUser) {
        const { password: _password, ...publicUser } = localUser;
        finishAuth(publicUser, "Вы успешно вошли в аккаунт");
        return { ok: true };
      }

      return { ok: false, message: error.message || "Неверный email или пароль" };
    }
  }

  function handleLogout() {
    localStorage.removeItem("vskturnUser");
    setUser(null);
    setCurrentPage("home");
    showToast("Вы вышли из аккаунта");
  }

  function handleOpenApplication(tournament) {
    if (!user) {
      setIsLoginOpen(true);
      showToast("Сначала войдите в аккаунт");
      return;
    }

    const alreadyApplied = applications.some(
      (application) =>
        application.tournamentId === tournament.id &&
        application.userEmail === user.email
    );

    if (alreadyApplied) {
      showToast("Вы уже отправили заявку на этот турнир");
      return;
    }

    setSelectedTournament(tournament);
  }

  async function handleApplicationSubmit(applicationData) {
    const createdAt = new Date().toLocaleString("ru-RU");
    const newApplication = {
      id: Date.now(),
      tournamentId: selectedTournament.id,
      tournamentTitle: selectedTournament.title,
      game: selectedTournament.game,
      userEmail: user.email,
      status: "Новая",
      createdAt,
      ...applicationData,
    };

    await sendEmail({
      to: user.email,
      subject: `VSKturn 2026: заявка на ${selectedTournament.title}`,
      message: `Здравствуйте, ${user.name}!\n\nВаша заявка на турнир «${selectedTournament.title}» принята. Организатор свяжется с вами после проверки состава.`,
      adminSubject: `Новая заявка на турнир 2026: ${selectedTournament.title}`,
      adminMessage: "Поступила новая заявка на участие в турнире VSKturn 2026.",
      details: [
        { label: "Турнир", value: selectedTournament.title },
        { label: "Игра", value: selectedTournament.game },
        { label: "Команда", value: applicationData.teamName },
        { label: "Капитан", value: applicationData.captainName },
        { label: "Телефон", value: applicationData.phone },
        { label: "Состав", value: applicationData.players },
        { label: "Дата заявки", value: createdAt },
      ],
    });

    const savedApplication = { ...newApplication, emailStatus: "Письмо отправлено" };

    try {
      await saveApplication(savedApplication);
      setApplications((prev) => [...prev, savedApplication]);
      showToast("Заявка отправлена и сохранена на сервере");
    } catch (error) {
      setApplications((prev) => [...prev, { ...savedApplication, serverStatus: "Не сохранено на сервере" }]);
      showToast("Заявка сохранена локально, сервер временно недоступен");
    }

    setSelectedTournament(null);
  }

  async function handleContactSubmit(contactData) {
    const newContact = {
      id: Date.now(),
      createdAt: new Date().toLocaleString("ru-RU"),
      ...contactData,
    };

    try {
      await saveContact(newContact);
      setContacts((prev) => [newContact, ...prev]);
      showToast("Сообщение отправлено и сохранено на сервере");
    } catch (error) {
      setContacts((prev) => [newContact, ...prev]);
      showToast("Сообщение сохранено локально, сервер временно недоступен");
    }
  }

  async function handleCreateTeam(teamData) {
    if (!user) {
      setIsLoginOpen(true);
      showToast("Сначала войдите в аккаунт");
      return;
    }

    const invitedEmails = parseEmails(teamData.inviteEmails).filter(
      (email) => email !== user.email
    );

    const newTeam = {
      id: Date.now(),
      name: teamData.name.trim(),
      game: teamData.game.trim(),
      description: teamData.description.trim(),
      captainName: user.name,
      captainEmail: user.email,
      createdAt: new Date().toLocaleString("ru-RU"),
      bannerId: Math.floor(Math.random() * 12),
      members: [
        {
          name: user.name,
          email: user.email,
          role: "Капитан",
          status: "Участник",
        },
      ],
      invitedEmails: [...new Set(invitedEmails)],
    };

    try {
      await saveTeam(newTeam);
      setTeams((prev) => [newTeam, ...prev]);

      if (invitedEmails.length > 0) {
        const results = await Promise.allSettled(
          invitedEmails.map((email) =>
            sendTeamInvite({
              recipientEmail: email,
              teamName: newTeam.name,
              captainName: user.name,
              game: newTeam.game,
            })
          )
        );
        const failed = results.find((item) => item.status === "rejected");
        if (failed) {
          showToast(`Команда создана, приглашения сохранены, но письмо не ушло: ${failed.reason?.message || "проверьте SMTP"}`);
        } else {
          showToast("Команда создана, приглашения реально отправлены на email");
        }
      } else {
        showToast("Команда создана и сохранена на сервере");
      }
    } catch (error) {
      setTeams((prev) => [newTeam, ...prev]);
      showToast(error.message || "Команда создана, но письмо не отправилось. Проверьте SMTP сервер");
    }
  }

  async function handleInviteToTeam(teamId, emailsText) {
    if (!user) return;

    const newEmails = parseEmails(emailsText);
    const currentTeam = teams.find((team) => team.id === teamId && team.captainEmail === user.email);

    if (!currentTeam) {
      showToast("Команда не найдена или вы не капитан");
      return;
    }

    const memberEmails = currentTeam.members.map((member) => member.email);
    const filteredEmails = newEmails.filter(
      (email) =>
        email !== user.email &&
        !memberEmails.includes(email) &&
        !currentTeam.invitedEmails.includes(email)
    );

    if (filteredEmails.length === 0) {
      showToast("Нет новых email для приглашения");
      return;
    }

    const updatedTeam = {
      ...currentTeam,
      invitedEmails: [...currentTeam.invitedEmails, ...filteredEmails],
    };

    try {
      await updateTeam(updatedTeam);
      setTeams((prev) => prev.map((team) => (team.id === teamId ? updatedTeam : team)));

      const results = await Promise.allSettled(
        filteredEmails.map((email) =>
          sendTeamInvite({
            recipientEmail: email,
            teamName: currentTeam.name,
            captainName: user.name,
            game: currentTeam.game,
          })
        )
      );

      const failed = results.find((item) => item.status === "rejected");
      if (failed) {
        showToast(`Приглашение сохранено в кабинете, но письмо не ушло: ${failed.reason?.message || "проверьте SMTP"}`);
      } else {
        showToast("Настоящие приглашения отправлены на email");
      }
    } catch (error) {
      setTeams((prev) => prev.map((team) => (team.id === teamId ? updatedTeam : team)));
      showToast(error.message || "Приглашение сохранено локально, но сервер временно недоступен");
    }
  }

  function handleAcceptTeamInvite(teamId) {
    if (!user) return;

    setTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId || !team.invitedEmails.includes(user.email)) {
          return team;
        }

        return {
          ...team,
          invitedEmails: team.invitedEmails.filter(
            (email) => email !== user.email
          ),
          members: [
            ...team.members,
            {
              name: user.name,
              email: user.email,
              role: "Игрок",
              status: "Участник",
            },
          ],
        };
      })
    );

    showToast("Вы вступили в команду");
  }

  function handleDeclineTeamInvite(teamId) {
    if (!user) return;

    setTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team;

        return {
          ...team,
          invitedEmails: team.invitedEmails.filter(
            (email) => email !== user.email
          ),
        };
      })
    );

    showToast("Приглашение отклонено");
  }

  function handleDeleteTeam(teamId) {
    if (!user) return;

    setTeams((prev) =>
      prev.filter(
        (team) => !(team.id === teamId && team.captainEmail === user.email)
      )
    );

    showToast("Команда удалена");
  }

  async function handleAddTournament(tournamentData) {
    const sampleTeams = [
      "Team Alpha",
      "Team Bravo",
      "Team Cyber",
      "Team Delta",
      "Team Eclipse",
      "Team Frost",
      "Team Galaxy",
      "Team Hunter",
    ];

    const newTournament = {
      id: Date.now(),
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      level: "Custom cup",
      teams: sampleTeams,
      ...tournamentData,
    };

    try {
      await saveTournament(newTournament);
      setTournaments((prev) => [newTournament, ...prev]);
      showToast("Турнир добавлен и сохранён на сервере");
    } catch (error) {
      setTournaments((prev) => [newTournament, ...prev]);
      showToast("Турнир добавлен локально, сервер временно недоступен");
    }
  }

  function handleDeleteTournament(tournamentId) {
    setTournaments((prev) =>
      prev.filter((tournament) => tournament.id !== tournamentId)
    );

    setApplications((prev) =>
      prev.filter((application) => application.tournamentId !== tournamentId)
    );

    showToast("Турнир удалён");
  }

  async function handleUpdateApplicationStatus(applicationId, newStatus) {
    setApplications((prev) =>
      prev.map((application) =>
        application.id === applicationId
          ? { ...application, status: newStatus }
          : application
      )
    );

    try {
      await updateApplicationStatus(applicationId, newStatus);
      showToast(`Статус заявки изменён и сохранён на сервере: ${newStatus}`);
    } catch (error) {
      showToast(`Статус изменён локально: ${newStatus}`);
    }
  }

  function handleDeleteApplication(applicationId) {
    setApplications((prev) =>
      prev.filter((application) => application.id !== applicationId)
    );

    showToast("Заявка удалена");
  }

  function handleDeleteContact(contactId) {
    setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
    showToast("Обращение удалено");
  }

  function handleResetDemoData() {
    setTournaments(DEFAULT_TOURNAMENTS);
    setApplications([]);
    setContacts([]);
    setTeams(DEFAULT_TEAMS);
    showToast("Демо-данные сброшены");
  }

  const userTeams = useMemo(() => {
    if (!user) {
      return [];
    }

    return teams.filter((team) =>
      team.members.some((member) => member.email === user.email)
    );
  }, [teams, user]);

  function renderPage() {
    if (currentPage === "dashboard" && user) {
      return (
        <DashboardPage
          user={user}
          teams={teams}
          applications={applications}
          onBackToSite={() => navigateTo("home")}
          onCreateTeam={handleCreateTeam}
          onInviteToTeam={handleInviteToTeam}
          onAcceptInvite={handleAcceptTeamInvite}
          onDeclineInvite={handleDeclineTeamInvite}
          onDeleteTeam={handleDeleteTeam}
        />
      );
    }

    if (currentPage === "admin") {
      if (user?.role !== "admin") {
        return (
          <section className="px-6 py-20">
            <div className="mx-auto max-w-3xl rounded-3xl border border-red-400/30 bg-red-500/10 p-8">
              <h1 className="mb-4 text-3xl font-black">Доступ закрыт</h1>
              <p className="mb-6 text-gray-300">
                Админ-панель доступна только пользователю с email admin@vskturn.ru.
              </p>
              <button
                onClick={() => navigateTo("home")}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
              >
                На главную
              </button>
            </div>
          </section>
        );
      }

      return (
        <Admin
          tournaments={tournaments}
          applications={applications}
          contacts={contacts}
          teams={teams}
          onAddTournament={handleAddTournament}
          onDeleteTournament={handleDeleteTournament}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onDeleteApplication={handleDeleteApplication}
          onDeleteContact={handleDeleteContact}
          onResetDemoData={handleResetDemoData}
        />
      );
    }

    if (currentPage === "tournaments") {
      return (
        <Tournaments
          tournaments={tournaments}
          onApplicationClick={handleOpenApplication}
        />
      );
    }

    if (currentPage === "teams") {
      return (
        <Teams
          user={user}
          teams={teams}
          onLoginClick={() => setIsLoginOpen(true)}
          onCreateTeam={handleCreateTeam}
          onInviteToTeam={handleInviteToTeam}
          onAcceptInvite={handleAcceptTeamInvite}
          onDeclineInvite={handleDeclineTeamInvite}
          onDeleteTeam={handleDeleteTeam}
        />
      );
    }

    if (currentPage === "services") {
      return <Services />;
    }

    if (currentPage === "contacts") {
      return <Contacts onContactSubmit={handleContactSubmit} />;
    }

    return (
      <Home
        teamsCount={teams.length}
        tournamentsCount={tournaments.length}
        onNavigate={navigateTo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070812] text-white">
      <Header
        user={user}
        currentPage={currentPage}
        onNavigate={navigateTo}
        onDashboardClick={openDashboard}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      <main>{renderPage()}</main>

      <Footer />

      {isEducationNoticeOpen && (
        <EducationNoticeModal
          onClose={() => {
            setIsEducationNoticeOpen(false);
          }}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {selectedTournament && (
        <ApplicationModal
          tournament={selectedTournament}
          userTeams={userTeams}
          onClose={() => setSelectedTournament(null)}
          onSubmit={handleApplicationSubmit}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

function EducationNoticeModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] border border-cyan-400/35 bg-[#07111f] p-8 text-center shadow-2xl shadow-cyan-500/20">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-300/30 bg-cyan-400/10 text-5xl">
          🎓
        </div>
        <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
          VSKturn
        </p>
        <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
          Учебный материал
        </h2>
        <p className="mx-auto mb-8 max-w-md leading-7 text-gray-300">
          Данный сайт является учебным материалом и выполнен исключительно в образовательных целях.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-cyan-400 px-8 py-4 font-black text-black transition hover:-translate-y-1 hover:bg-white"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

export default App;
