 @echo off
echo Starting AI Closet App with Windows fix...
echo.
cd /d "%~dp0"
set NODE_OPTIONS=--no-experimental-sea
echo.
echo Starting Expo... This may take a moment.
echo.
npx expo start --clear
if errorlevel 1 (
    echo.
    echo Error occurred! Press any key to see the error details...
    pause
    exit /b 1
)
pause

