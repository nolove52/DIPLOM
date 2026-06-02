# VSKturn mail server — готовая чистая версия

Эта версия сервера работает **без `npm install`**. Используются только встроенные модули Node.js.

## Важно

Настоящий пароль для SMTP нельзя придумать вручную. Его нужно создать в почтовом аккаунте:

- для Mail.ru — пароль для внешнего приложения;
- для Gmail — пароль приложения.

Обычный пароль от почты чаще всего не работает.

## Что поменять перед запуском

Открой файл `.env` и замени строку:

```env
SMTP_PASS=ВСТАВЬ_СЮДА_ПАРОЛЬ_ДЛЯ_ВНЕШНЕГО_ПРИЛОЖЕНИЯ_MAIL_RU
```

на реальный пароль внешнего приложения Mail.ru.

## Запуск в VS Code

Открой терминал в папке `server`:

```powershell
cd C:\Users\nolov\Desktop\dimpom2\diplom\app\server
node index.js
```

Проверка сервера:

```text
http://localhost:5000/api/health
```

## Проверка письма

Во втором терминале VS Code:

```powershell
./send-test.ps1
```

Или вручную:

```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/send-email -Method POST -ContentType "application/json" -Body '{"to":"nolove.vanlav@mail.ru","subject":"Тест VSKturn 2026","message":"Проверка отправки письма"}'
```

## Проверка SMTP-портов

```powershell
./check-ports.ps1
```

Если `TcpTestSucceeded : False`, значит порт блокируется сетью/антивирусом/провайдером. Попробуй другой интернет, например раздать с телефона.

## Если порт 587 не работает

В `.env` попробуй так:

```env
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_STARTTLS=false
```

После любого изменения `.env` нужно перезапустить сервер: `Ctrl + C`, затем `node index.js`.
