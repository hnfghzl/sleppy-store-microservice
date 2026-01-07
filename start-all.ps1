# PowerShell script to start all microservices
Write-Host "Starting all microservices..." -ForegroundColor Green
Write-Host ""

# Create data directories
$services = @("auth-service", "product-service", "order-service", "payment-service", "user-service")
foreach ($service in $services) {
    $dataPath = "services\$service\data"
    if (-not (Test-Path $dataPath)) {
        New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
        Write-Host "Created $dataPath" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Opening terminals for each service..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Start each service in a new terminal
Start-Process cmd -ArgumentList "/k", "cd /d `"$PWD\services\auth-service`" && title Auth Service - Port 3001 && npm start"
Start-Sleep -Seconds 1

Start-Process cmd -ArgumentList "/k", "cd /d `"$PWD\services\product-service`" && title Product Service - Port 3002 && npm start"
Start-Sleep -Seconds 1

Start-Process cmd -ArgumentList "/k", "cd /d `"$PWD\services\order-service`" && title Order Service - Port 3003 && npm start"
Start-Sleep -Seconds 1

Start-Process cmd -ArgumentList "/k", "cd /d `"$PWD\services\payment-service`" && title Payment Service - Port 3004 && npm start"
Start-Sleep -Seconds 1

Start-Process cmd -ArgumentList "/k", "cd /d `"$PWD\services\user-service`" && title User Service - Port 3005 && npm start"
Start-Sleep -Seconds 1

Start-Process cmd -ArgumentList "/k", "cd /d `"$PWD\services\api-gateway`" && title API Gateway - Port 3000 && npm start"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "All services are starting!" -ForegroundColor Green  
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  API Gateway:    http://localhost:3000" -ForegroundColor White
Write-Host "  Auth Service:   http://localhost:3001" -ForegroundColor White
Write-Host "  Product Service:http://localhost:3002" -ForegroundColor White
Write-Host "  Order Service:  http://localhost:3003" -ForegroundColor White
Write-Host "  Payment Service:http://localhost:3004" -ForegroundColor White
Write-Host "  User Service:   http://localhost:3005" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop services" -ForegroundColor Yellow
Write-Host ""

# Wait a bit and test if API Gateway is ready
Start-Sleep -Seconds 5
Write-Host "Testing API Gateway..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 2
    Write-Host "[OK] API Gateway is running!" -ForegroundColor Green
} catch {
    Write-Host "[WARN] API Gateway may still be starting up. Give it a few more seconds." -ForegroundColor Yellow
}
