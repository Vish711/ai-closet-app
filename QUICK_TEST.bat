@echo off
echo ========================================
echo AI Closet App - Quick Test
echo ========================================
echo.
echo This will help you test the app quickly.
echo.
echo STEP 1: Start Backend
echo ----------------------
echo Open a NEW terminal and run:
echo   cd backend
echo   npm run dev
echo.
echo Press any key when backend is running...
pause

echo.
echo STEP 2: Start Frontend
echo ----------------------
echo Starting frontend...
echo.
cd /d "%~dp0"
start cmd /k "npm start"

echo.
echo ========================================
echo Frontend starting...
echo.
echo In the Expo terminal:
echo   1. Press 'w' to open web browser
echo   2. Or scan QR code for mobile
echo.
echo ========================================
echo.
echo Testing Checklist:
echo [ ] Create account (test@example.com / Test123!@#)
echo [ ] Add clothing item with photo
echo [ ] Generate AI outfits
echo [ ] View calendar
echo [ ] Check settings
echo.
echo ========================================
pause


