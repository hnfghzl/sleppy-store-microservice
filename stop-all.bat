@echo off
echo Stopping all Node.js services...
taskkill /F /IM node.exe >nul 2>&1
echo All services stopped!
pause
