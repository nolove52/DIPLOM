VSKturn исправленная версия

Что исправлено:
1. Удалены лишние .env и дублирующая папка server.
2. Оставлен один backend: app/backend.
3. Исправлена ошибка React Dev Server: allowedHosts[0] should be a non-empty string.
   В корневом .env больше нет HOST=.
4. Удалены package-lock.json с неправильными ссылками на packages.applied-caas...
5. Добавлен .npmrc с registry=https://registry.npmjs.org/
6. Убрана нижняя техническая надпись в модальном окне регистрации.
7. Приглашение теперь сохраняется в личном кабинете даже если SMTP временно не отправил письмо.

Как запустить:

1. Открой папку app в VS Code.

2. Установи frontend:
   npm install

3. Открой второй терминал и запусти backend:
   cd backend
   npm install
   npm start

4. В первом терминале запусти frontend:
   npm start

Проверка backend:
http://localhost:5000/api/health

Проверка SMTP:
http://localhost:5000/api/mail/diagnose

ВАЖНО ПО MAIL.RU:
В файле backend/.env нужно заменить строку SMTP_PASS на настоящий пароль внешнего приложения Mail.ru.
Обычный пароль от почты не подходит.

Правильный пример backend/.env:
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_REQUIRE_TLS=false
SMTP_USER=nolove.vanlav@mail.ru
SMTP_PASS=ТУТ_ПАРОЛЬ_ВНЕШНЕГО_ПРИЛОЖЕНИЯ
MAIL_FROM=VSKturn <nolove.vanlav@mail.ru>

Если 465 не работает, попробуй:
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true

После любого изменения backend/.env обязательно перезапусти backend через Ctrl+C и npm start.
