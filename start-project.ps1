# Farmer Market Intelligence - Startup Script

Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting Farmer Market Intelligence" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node local-server.js; Write-Host 'Backend server stopped' -ForegroundColor Red"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev; Write-Host 'Frontend server stopped' -ForegroundColor Red"

# Wait for frontend to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Servers are running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  " -NoNewline
Write-Host "http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

# Open browser
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "To stop servers:" -ForegroundColor Yellow
Write-Host "  - Close the PowerShell windows" -ForegroundColor White
Write-Host "  - Or press Ctrl+C in each window" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
