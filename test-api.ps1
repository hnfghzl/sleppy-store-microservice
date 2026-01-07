# Test Script untuk Microservices API
# Jalankan dengan: powershell -ExecutionPolicy Bypass -File test-api.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTING MICROSERVICES API" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Get All Products
Write-Host "[TEST 1] GET /api/products" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/products' -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor White
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n"

# Test 2: Register User
Write-Host "[TEST 2] POST /api/auth/register" -ForegroundColor Yellow
try {
    $body = @{
        email = 'testuser@example.com'
        password = 'Test123456'
        fullName = 'Test User'
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/register' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor White
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
    
    # Simpan token untuk test selanjutnya
    $global:token = ($response.Content | ConvertFrom-Json).token
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n"

# Test 3: Login
Write-Host "[TEST 3] POST /api/auth/login" -ForegroundColor Yellow
try {
    $body = @{
        email = 'testuser@example.com'
        password = 'Test123456'
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor White
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
    
    # Update token
    $global:token = ($response.Content | ConvertFrom-Json).token
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n"

# Test 4: Get Product by ID
Write-Host "[TEST 4] GET /api/products/1" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/products/1' -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor White
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n"

# Test 5: Create Order (butuh token)
if ($global:token) {
    Write-Host "[TEST 5] POST /api/orders (with JWT token)" -ForegroundColor Yellow
    try {
        $body = @{
            productId = 1
            quantity = 1
        } | ConvertTo-Json
        
        $headers = @{
            'Authorization' = "Bearer $($global:token)"
        }
        
        $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/orders' -Method POST -Body $body -ContentType 'application/json' -Headers $headers -UseBasicParsing
        Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor White
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
        
        # Simpan order ID untuk test payment
        $global:orderId = ($response.Content | ConvertFrom-Json).order.id
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "[TEST 5] SKIPPED - No authentication token" -ForegroundColor Gray
}

Write-Host "`n----------------------------------------`n"

# Test 6: Get User Orders
if ($global:token) {
    Write-Host "[TEST 6] GET /api/orders (with JWT token)" -ForegroundColor Yellow
    try {
        $headers = @{
            'Authorization' = "Bearer $($global:token)"
        }
        
        $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/orders' -Headers $headers -UseBasicParsing
        Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor White
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "[TEST 6] SKIPPED - No authentication token" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:3000" -ForegroundColor White
Write-Host "Token: $($global:token -ne $null)" -ForegroundColor White
if ($global:orderId) {
    Write-Host "Created Order ID: $global:orderId" -ForegroundColor White
}
Write-Host "`nSemua service berjalan dengan baik!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
