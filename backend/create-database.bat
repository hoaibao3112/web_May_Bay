@echo off
echo ================================
echo Tao database MySQL
echo ================================
echo.

echo Neu ban chua cai MySQL, hay cai tu: https://dev.mysql.com/downloads/installer/
echo.

echo Nhap password root cua MySQL (mac dinh: password):
set /p MYSQL_PASSWORD=Password: 

echo.
echo Dang tao database flight_booking...
mysql -u root -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS flight_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% == 0 (
    echo.
    echo [SUCCESS] Database flight_booking da duoc tao thanh cong!
    echo.
    echo Tiep theo, chay cac lenh sau:
    echo   npm run prisma:migrate
    echo   npm run seed
    echo   npm run start:dev
) else (
    echo.
    echo [ERROR] Loi tao database. Kiem tra lai MySQL va password.
)

pause
