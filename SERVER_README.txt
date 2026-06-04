VSKturn: что добавлено

1. Footer
- Убрана карта.
- Убрана строка t.me/vskturn.
- Почта заменена на nolove.vanlav@mail.ru.

2. Серверная часть
Папка backend содержит Express API.
Данные сохраняются в файл backend/data/database.json.

Куда уходят данные:
- регистрация: POST /api/auth/register -> database.json, раздел users
- вход: POST /api/auth/login -> проверка users или admin@vskturn.ru/admin
- заявки: POST /api/applications -> database.json, раздел applications
- обращения: POST /api/contacts -> database.json, раздел contacts
- команды: POST /api/teams -> database.json, раздел teams
- турниры: POST /api/tournaments -> database.json, раздел tournaments
- email-уведомления: POST /api/send-email -> SMTP или database.json, раздел emails

3. Запуск локально
В первом терминале:
cd backend
npm install
npm run dev

Во втором терминале из корня проекта:
npm install
npm run dev

Адрес фронтенда: http://localhost:3000
Адрес сервера: http://localhost:5000

4. Администратор
Email: admin@vskturn.ru
Пароль: admin

5. Timeweb Cloud
Для Timeweb нужно отдельно запустить backend как Node.js приложение.
Во фронтенде указать переменную окружения:
REACT_APP_API_URL=https://адрес-твоего-backend

Если SMTP не настроен, письма не отправляются наружу, но сохраняются в database.json.
