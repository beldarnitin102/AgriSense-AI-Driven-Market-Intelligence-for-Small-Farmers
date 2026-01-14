@echo off
echo ========================================
echo Starting Farmer Market Intelligence
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node local-server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servers are starting...
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:3000

echo.
echo To stop servers, close the terminal windows
echo or press Ctrl+C in each window
echo.
