Write-Host "Проверка SMTP-портов Mail.ru..." -ForegroundColor Cyan
Test-NetConnection smtp.mail.ru -Port 587
Test-NetConnection smtp.mail.ru -Port 465
Write-Host "Проверка SMTP-портов Gmail..." -ForegroundColor Cyan
Test-NetConnection smtp.gmail.com -Port 587
Test-NetConnection smtp.gmail.com -Port 465
