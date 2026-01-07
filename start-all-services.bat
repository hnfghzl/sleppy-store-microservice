@echo off
echo Starting all microservices...
echo.

echo Starting API Gateway (Port 3000)...
start "API Gateway" cmd /k "cd services\api-gateway && node src\index.js"
timeout /t 2 /nobreak >nul

echo Starting Auth Service (Port 3001)...
start "Auth Service" cmd /k "cd services\auth-service && node src\index.js"
timeout /t 2 /nobreak >nul

echo Starting Product Service (Port 3002)...
start "Product Service" cmd /k "cd services\product-service && node src\index.js"
timeout /t 2 /nobreak >nul

echo Starting Order Service (Port 3003)...
start "Order Service" cmd /k "cd services\order-service && node src\index.js"
timeout /t 2 /nobreak >nul

echo Starting Payment Service (Port 3004)...
start "Payment Service" cmd /k "cd services\payment-service && node src\index.js"
timeout /t 2 /nobreak >nul

echo Starting User Service (Port 3005)...
start "User Service" cmd /k "cd services\user-service && node src\index.js"
timeout /t 2 /nobreak >nul

echo Starting Frontend (Port 3006)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services started!
echo Check each window for any errors.
pause
