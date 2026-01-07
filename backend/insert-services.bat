@echo off
echo ================================
echo Insert Airport Transfer Services
echo ================================
echo.

echo Nhap password root cua MySQL (mac dinh tren may cua ban):
set /p MYSQL_PASSWORD=Password: 

echo.
echo Dang them du lieu dich vu dua don san bay...
mysql -u root -p%MYSQL_PASSWORD% web_may_bay < insert-airport-transfer-services.sql

if %ERRORLEVEL% == 0 (
    echo.
    echo [SUCCESS] Da them thanh cong cac dich vu dua don san bay!
    echo.
    echo Ban co the khoi dong lai server va thu dat xe:
    echo   npm run start:dev
) else (
    echo.
    echo [ERROR] Loi them du lieu. Kiem tra lai MySQL va password.
    echo.
    echo Luu y: Database 'web_may_bay' can phai ton tai truoc.
)

echo.
pause
