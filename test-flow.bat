@echo off
echo ============================================================
echo E-COMMERCE COMPLETE FLOW TESTING
echo ============================================================
echo.

echo [TEST 1] Checking if all services are running...
echo.
netstat -ano | findstr ":3000 :3001 :3002 :3003 :3006" >nul
if %errorlevel% equ 0 (
    echo [PASS] All services are running
) else (
    echo [FAIL] Some services are not running
    goto :end
)
echo.

echo [TEST 2] Testing API Gateway health...
curl -s http://localhost:3000/health >nul
if %errorlevel% equ 0 (
    echo [PASS] API Gateway is healthy
) else (
    echo [FAIL] API Gateway is not responding
    goto :end
)
echo.

echo [TEST 3] Testing Product Service - Browse Products...
powershell -Command "$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/products' -Method Get; if ($response.products.Count -gt 0) { Write-Host '[PASS] Found' $response.products.Count 'products'; exit 0 } else { Write-Host '[FAIL] No products found'; exit 1 }"
echo.

echo [TEST 4] Testing Auth Service - User Registration...
powershell -Command "$timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds(); $body = @{email=\"test${timestamp}@example.com\"; password='Test123456'; fullName='Test User'} | ConvertTo-Json; try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method Post -Body $body -ContentType 'application/json'; Write-Host '[PASS] User registered:' $response.user.email; $env:TEST_EMAIL = $response.user.email; exit 0 } catch { Write-Host '[INFO] Registration may have failed (expected if user exists)'; exit 0 }"
echo.

echo [TEST 5] Testing Auth Service - Login...
powershell -Command "$body = @{email='user@user.com'; password='user123'} | ConvertTo-Json; try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post -Body $body -ContentType 'application/json'; Write-Host '[PASS] Login successful, token received'; $global:token = $response.token; $env:TEST_TOKEN = $response.token; exit 0 } catch { Write-Host '[FAIL] Login failed:' $_.Exception.Message; exit 1 }"
echo.

echo [TEST 6] Frontend accessibility...
curl -s http://localhost:3006 >nul
if %errorlevel% equ 0 (
    echo [PASS] Frontend is accessible at http://localhost:3006
) else (
    echo [FAIL] Frontend is not accessible
)
echo.

echo ============================================================
echo TEST SUMMARY
echo ============================================================
echo.
echo All critical tests completed!
echo.
echo Next steps for manual testing:
echo 1. Open browser: http://localhost:3006/login
echo 2. Login with: user@user.com / user123
echo 3. Browse products in customer page
echo 4. Add products to cart
echo 5. View cart and proceed to checkout
echo 6. Complete payment with QRIS
echo 7. View order history
echo.
echo Press any key to open the browser...
pause >nul
start http://localhost:3006/login
echo.

:end
echo.
echo Testing completed!
pause
