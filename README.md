# VSKturn 2026

React + Tailwind проект для сайта киберспортивных турниров.

## Что добавлено

- Разделы сайта открываются как отдельные страницы внутри приложения.
- Турниры 2026 вынесены в отдельную страницу.
- Добавлены популярные игры и 16 демо-турниров.
- Турнирная сетка сделана полноценной горизонтальной сеткой: 1/4 финала, 1/2 финала, финал, чемпион.
- Добавлена отправка настоящих писем через backend на Node.js + Nodemailer.
- Письмо отправляется на email, который пользователь указывает в форме контактов.
- При заявке на турнир письмо отправляется на email пользователя, который вошёл в аккаунт.
- Добавлена оптимизация: `useMemo`, `useCallback`, `React.memo`, lazy-loading изображений.

## Запуск frontend

```bash
npm install
npm start
```

Frontend откроется на:

```text
http://localhost:3000
```

## Запуск backend для настоящих писем

Перейдите в папку сервера:

```bash
cd server
npm install
```

Скопируйте пример настроек:

```bash
cp .env.example .env
```

Заполните `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=your-email@gmail.com
```

Для Gmail обычно нужен не обычный пароль, а пароль приложения.

Запустите backend:

```bash
npm start
```

Backend будет работать на:

```text
http://localhost:5000
```

Проверка сервера:

```text
http://localhost:5000/api/health
```

## Как работает отправка письма

1. Пользователь заполняет форму на сайте.
2. React отправляет данные на `http://localhost:5000/api/send-email`.
3. Backend отправляет настоящее письмо через SMTP.
4. Пользователь получает письмо на email, который указал в форме.
5. Администратор получает копию на `ADMIN_EMAIL`.

## Вход администратора

```text
admin@vskturn.ru
```

Пароль в демо-версии не проверяется, потому что авторизация учебная и хранится в `localStorage`.

## Если npm install выдаёт ECONNRESET или packages.applied-caas...

В архиве убраны `package-lock.json`, а также добавлены `.npmrc` файлы с обычным публичным npm-реестром. Если ошибка останется, выполните в корне проекта и в папке `server`:

```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install --registry=https://registry.npmjs.org/
```

