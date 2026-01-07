@echo off
echo ========================================
echo Troubleshooting Microservices
echo ========================================
echo.

echo [1] Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not installed!
    pause
    exit /b 1
)
echo OK: Node.js installed
echo.

echo [2] Checking MySQL connection...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: MySQL CLI not found in PATH
    echo Make sure XAMPP MySQL is running!
) else (
    echo OK: MySQL CLI found
)
echo.

echo [3] Checking if MySQL is running...
netstat -an | findstr ":3306" >nul
if errorlevel 1 (
    echo ERROR: MySQL not running on port 3306!
    echo Please start MySQL in XAMPP Control Panel
    pause
    exit /b 1
) else (
    echo OK: MySQL is running on port 3306
)
echo.

echo [4] Checking node_modules...
set missing=0
if not exist "services\auth-service\node_modules" (
    echo ERROR: auth-service node_modules missing!
    set missing=1
)
if not exist "services\product-service\node_modules" (
    echo ERROR: product-service node_modules missing!
    set missing=1
)
if not exist "services\order-service\node_modules" (
    echo ERROR: order-service node_modules missing!
    set missing=1
)
if not exist "services\payment-service\node_modules" (
    echo ERROR: payment-service node_modules missing!
    set missing=1
)
if not exist "services\user-service\node_modules" (
    echo ERROR: user-service node_modules missing!
    set missing=1
)
if not exist "services\api-gateway\node_modules" (
    echo ERROR: api-gateway node_modules missing!
    set missing=1
)

if %missing%==1 (
    echo.
    echo Running npm install for all services...
    echo.
    
    cd services\auth-service && call npm install
    cd ..\..
    
    cd services\product-service && call npm install
    cd ..\..
    
    cd services\order-service && call npm install
    cd ..\..
    
    cd services\payment-service && call npm install
    cd ..\..
    
    cd services\user-service && call npm install
    cd ..\..
    
    cd services\api-gateway && call npm install
    cd ..\..
    
    echo.
    echo All packages installed!
) else (
    echo OK: All node_modules present
)
echo.

echo [5] Checking .env files...
if not exist "services\auth-service\.env" echo WARNING: auth-service .env missing!
if not exist "services\product-service\.env" echo WARNING: product-service .env missing!
if not exist "services\order-service\.env" echo WARNING: order-service .env missing!
if not exist "services\payment-service\.env" echo WARNING: payment-service .env missing!
if not exist "services\user-service\.env" echo WARNING: user-service .env missing!
echo.

echo [6] Testing services individually...
echo.

echo Testing Auth Service...
cd services\auth-service
start "Test Auth" cmd /c "node src\index.js & timeout /t 3"
timeout /t 5 /nobreak >nul
curl -s http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo ERROR: Auth Service failed to start!
    echo Check the "Test Auth" window for errors
) else (
    echo OK: Auth Service running
)
taskkill /FI "WINDOWTITLE eq Test Auth*" /F >nul 2>&1
cd ..\..
echo.

echo Testing Product Service...
cd services\product-service
start "Test Product" cmd /c "node src\index.js & timeout /t 3"
timeout /t 5 /nobreak >nul
curl -s http://localhost:3002/health >nul 2>&1
if errorlevel 1 (
    echo ERROR: Product Service failed to start!
    echo Check the "Test Product" window for errors
) else (
    echo OK: Product Service running
)
taskkill /FI "WINDOWTITLE eq Test Product*" /F >nul 2>&1
cd ..\..
echo.

echo Testing API Gateway...
cd services\api-gateway
start "Test Gateway" cmd /c "node src\index.js & timeout /t 3"
timeout /t 5 /nobreak >nul
curl -s http://localhost:3000/health >nul 2>&1
if errorlevel 1 (
    echo ERROR: API Gateway failed to start!
    echo Check the "Test Gateway" window for errors
) else (
    echo OK: API Gateway running
)
taskkill /FI "WINDOWTITLE eq Test Gateway*" /F >nul 2>&1
cd ..\..
echo.

echo ========================================
echo Troubleshooting Complete!
echo ========================================
echo.
echo If all tests passed, run: start.bat
echo.
pause
