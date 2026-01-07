@echo off
echo Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Creating data directories...
if not exist "services\auth-service\data" mkdir "services\auth-service\data"
if not exist "services\product-service\data" mkdir "services\product-service\data"
if not exist "services\order-service\data" mkdir "services\order-service\data"
if not exist "services\payment-service\data" mkdir "services\payment-service\data"
if not exist "services\user-service\data" mkdir "services\user-service\data"

echo.
echo Starting all services...
echo.

start "Auth Service" cmd /k "cd services\auth-service && echo Auth Service (Port 3001) && node src\index.js"
timeout /t 2 /nobreak >nul

start "Product Service" cmd /k "cd services\product-service && echo Product Service (Port 3002) && node src\index.js"
timeout /t 2 /nobreak >nul

start "Order Service" cmd /k "cd services\order-service && echo Order Service (Port 3003) && node src\index.js"
timeout /t 2 /nobreak >nul

start "Payment Service" cmd /k "cd services\payment-service && echo Payment Service (Port 3004) && node src\index.js"
timeout /t 2 /nobreak >nul

start "User Service" cmd /k "cd services\user-service && echo User Service (Port 3005) && node src\index.js"
timeout /t 2 /nobreak >nul

start "API Gateway" cmd /k "cd services\api-gateway && echo API Gateway (Port 3000) && node src\index.js"

echo.
echo ================================================
echo All services are starting in separate windows!
echo ================================================
echo.
echo Service URLs:
echo   API Gateway:     http://localhost:3000
echo   Auth Service:    http://localhost:3001
echo   Product Service: http://localhost:3002
echo   Order Service:   http://localhost:3003
echo   Payment Service: http://localhost:3004
echo   User Service:    http://localhost:3005
echo.
echo Press Ctrl+C in each window to stop that service
echo ================================================
echo.

REM Wait and test
timeout /t 8 /nobreak >nul
echo Testing API Gateway...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing -TimeoutSec 3; Write-Host '[OK] API Gateway is running!' -ForegroundColor Green; $r.Content } catch { Write-Host '[ERROR] API Gateway not responding' -ForegroundColor Red }"

echo.
pause
