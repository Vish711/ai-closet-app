@echo off
echo Starting Expo in TUNNEL mode...
echo This works even if your phone is on a different Wi-Fi!
echo.
cd /d "%~dp0"
npx expo start --tunnel --clear
pause

