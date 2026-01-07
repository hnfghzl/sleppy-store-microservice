@echo off
echo ============================================
echo Starting All Microservices
echo ============================================
echo.

REM Kill existing node processes
taskkill /F /IM node.exe >nul 2>&1

echo Starting services in background...
echo.

REM Start API Gateway
start /B "API Gateway" cmd /c "cd services\api-gateway && node src\index.js > logs-gateway.txt 2>&1"
echo [1/6] API Gateway starting on port 3000...
timeout /t 2 /nobreak >nul

REM Start Auth Service
start /B "Auth Service" cmd /c "cd services\auth-service && node src\index.js > logs-auth.txt 2>&1"
echo [2/6] Auth Service starting on port 3001...
timeout /t 2 /nobreak >nul

REM Start Product Service
start /B "Product Service" cmd /c "cd services\product-service && node src\index.js > logs-product.txt 2>&1"
echo [3/6] Product Service starting on port 3002...
timeout /t 2 /nobreak >nul

REM Start Order Service
start /B "Order Service" cmd /c "cd services\order-service && node src\index.js > logs-order.txt 2>&1"
echo [4/6] Order Service starting on port 3003...
timeout /t 2 /nobreak >nul

REM Start Payment Service
start /B "Payment Service" cmd /c "cd services\payment-service && node src\index.js > logs-payment.txt 2>&1"
echo [5/6] Payment Service starting on port 3004...
timeout /t 2 /nobreak >nul

REM Start User Service
start /B "User Service" cmd /c "cd services\user-service && node src\index.js > logs-user.txt 2>&1"
echo [6/6] User Service starting on port 3005...
timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo All services are running in background!
echo ============================================
echo.
echo Service URLs:
echo   API Gateway:     http://localhost:3000
echo   Auth Service:    http://localhost:3001
echo   Product Service: http://localhost:3002
echo   Order Service:   http://localhost:3003
echo   Payment Service: http://localhost:3004
echo   User Service:    http://localhost:3005
echo.
echo Logs saved to:
echo   logs-gateway.txt, logs-auth.txt, logs-product.txt
echo   logs-order.txt, logs-payment.txt, logs-user.txt
echo.
echo To stop all services: run stop-all.bat
echo ============================================
echo.

REM Check if services are running
timeout /t 2 /nobreak >nul
netstat -ano | findstr ":300" | findstr "LISTENING"

echo.
pause
