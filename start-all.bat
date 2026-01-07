@echo off
echo Starting all microservices...
echo.

REM Create data directories for SQLite databases
if not exist "services\auth-service\data" mkdir "services\auth-service\data"
if not exist "services\product-service\data" mkdir "services\product-service\data"
if not exist "services\order-service\data" mkdir "services\order-service\data"
if not exist "services\payment-service\data" mkdir "services\payment-service\data"
if not exist "services\user-service\data" mkdir "services\user-service\data"

echo Starting Auth Service on port 3001...
start "Auth Service" cmd /k "cd services\auth-service && npm start"
timeout /t 2 /nobreak >nul

echo Starting Product Service on port 3002...
start "Product Service" cmd /k "cd services\product-service && npm start"
timeout /t 2 /nobreak >nul

echo Starting Order Service on port 3003...
start "Order Service" cmd /k "cd services\order-service && npm start"
timeout /t 2 /nobreak >nul

echo Starting Payment Service on port 3004...
start "Payment Service" cmd /k "cd services\payment-service && npm start"
timeout /t 2 /nobreak >nul

echo Starting User Service on port 3005...
start "User Service" cmd /k "cd services\user-service && npm start"
timeout /t 2 /nobreak >nul

echo Starting API Gateway on port 3000...
start "API Gateway" cmd /k "cd services\api-gateway && npm start"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo API Gateway: http://localhost:3000
echo Auth Service: http://localhost:3001
echo Product Service: http://localhost:3002
echo Order Service: http://localhost:3003
echo Payment Service: http://localhost:3004
echo User Service: http://localhost:3005
echo ========================================
echo.
echo Press any key to stop all services...
pause >nul

taskkill /FI "WINDOWTITLE eq Auth Service*" /T /F
taskkill /FI "WINDOWTITLE eq Product Service*" /T /F
taskkill /FI "WINDOWTITLE eq Order Service*" /T /F
taskkill /FI "WINDOWTITLE eq Payment Service*" /T /F
taskkill /FI "WINDOWTITLE eq User Service*" /T /F
taskkill /FI "WINDOWTITLE eq API Gateway*" /T /F

echo All services stopped.
