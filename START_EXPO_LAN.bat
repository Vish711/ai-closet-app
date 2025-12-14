@echo off
echo Starting Expo in LAN mode...
echo This will show your IP address (10.167.0.46) instead of localhost
echo.
cd /d "%~dp0"
npx expo start --lan --clear
pause

