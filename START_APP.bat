@echo off
title AI Closet App
echo ========================================
echo   AI Closet App - Starting...
echo ========================================
echo.

cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo.

echo Checking npm...
npm --version
if errorlevel 1 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
echo.

echo Clearing Expo cache...
if exist .expo rmdir /s /q .expo
echo.

echo Starting Expo development server...
echo This will take 10-30 seconds...
echo.
echo ========================================
echo.

npx expo start --clear

echo.
echo ========================================
echo Expo server stopped.
pause
