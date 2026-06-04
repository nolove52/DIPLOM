Что исправлено

1. Убрана нижняя надпись в окне регистрации.
2. Исправлена причина ошибки Failed to fetch при регистрации:
   фронтенд теперь обращается к API через относительный путь /api и использует proxy на http://localhost:5000.
3. npm start в корневой папке app теперь запускает React dev server, а не старую build-версию.
4. Если backend не запущен, регистрация больше не падает с Failed to fetch: аккаунт создаётся локально в localStorage.
5. Backend теперь принимает запросы с localhost и 127.0.0.1.

Как запускать

Терминал 1:
cd backend
npm install
npm start

Терминал 2:
npm install
npm start

Проверка backend:
http://localhost:5000/api/health

Проверка frontend:
http://localhost:3000

Важно

Для настоящих писем проверьте файл backend/.env и пароль приложения Mail.ru.
Файл backend/.env нельзя загружать в публичный GitHub, потому что там находится SMTP пароль.
