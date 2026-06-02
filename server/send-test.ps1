param(
  [string]$To = "nolove.vanlav@mail.ru"
)

$body = @{
  to = $To
  subject = "Тест VSKturn 2026"
  message = "Проверка настоящей отправки письма с сайта VSKturn 2026"
} | ConvertTo-Json -Compress

Invoke-RestMethod -Uri http://localhost:5000/api/send-email -Method POST -ContentType "application/json" -Body $body
