@echo off
echo ========================================
echo AI Closet App - Transfer Package Creator
echo ========================================
echo.
echo This script will help you create a clean transfer package.
echo.
echo IMPORTANT: This will create a copy WITHOUT node_modules
echo.
pause

echo.
echo Creating transfer package...
echo.

REM Create transfer folder
set "TRANSFER_FOLDER=AI_Closet_App_Transfer"
if exist "%TRANSFER_FOLDER%" (
    echo Removing old transfer folder...
    rmdir /s /q "%TRANSFER_FOLDER%"
)

mkdir "%TRANSFER_FOLDER%"

echo Copying files...
echo.

REM Copy all files except node_modules and .expo
xcopy /E /I /H /Y /EXCLUDE:exclude_list.txt . "%TRANSFER_FOLDER%\" 2>nul

REM Manual copy of important folders (more reliable)
echo Copying source code...
xcopy /E /I /Y "components" "%TRANSFER_FOLDER%\components\" 2>nul
xcopy /E /I /Y "screens" "%TRANSFER_FOLDER%\screens\" 2>nul
xcopy /E /I /Y "services" "%TRANSFER_FOLDER%\services\" 2>nul
xcopy /E /I /Y "hooks" "%TRANSFER_FOLDER%\hooks\" 2>nul
xcopy /E /I /Y "lib" "%TRANSFER_FOLDER%\lib\" 2>nul
xcopy /E /I /Y "theme" "%TRANSFER_FOLDER%\theme\" 2>nul
xcopy /E /I /Y "types" "%TRANSFER_FOLDER%\types\" 2>nul
xcopy /E /I /Y "backend\src" "%TRANSFER_FOLDER%\backend\src\" 2>nul

echo Copying configuration files...
copy /Y "App.tsx" "%TRANSFER_FOLDER%\" 2>nul
copy /Y "package.json" "%TRANSFER_FOLDER%\" 2>nul
copy /Y "package-lock.json" "%TRANSFER_FOLDER%\" 2>nul
copy /Y "tsconfig.json" "%TRANSFER_FOLDER%\" 2>nul
copy /Y "babel.config.js" "%TRANSFER_FOLDER%\" 2>nul
copy /Y "metro.config.js" "%TRANSFER_FOLDER%\" 2>nul
copy /Y "app.json" "%TRANSFER_FOLDER%\" 2>nul
copy /Y ".gitignore" "%TRANSFER_FOLDER%\" 2>nul

copy /Y "backend\package.json" "%TRANSFER_FOLDER%\backend\" 2>nul
copy /Y "backend\package-lock.json" "%TRANSFER_FOLDER%\backend\" 2>nul
copy /Y "backend\tsconfig.json" "%TRANSFER_FOLDER%\backend\" 2>nul
copy /Y "backend\.gitignore" "%TRANSFER_FOLDER%\backend\" 2>nul

echo Copying documentation...
copy /Y "*.md" "%TRANSFER_FOLDER%\" 2>nul
copy /Y "*.txt" "%TRANSFER_FOLDER%\" 2>nul

echo Copying batch files...
copy /Y "*.bat" "%TRANSFER_FOLDER%\" 2>nul
copy /Y "*.ps1" "%TRANSFER_FOLDER%\" 2>nul

echo Copying assets (if exists)...
if exist "assets" (
    xcopy /E /I /Y "assets" "%TRANSFER_FOLDER%\assets\" 2>nul
)

echo.
echo ========================================
echo Transfer package created: %TRANSFER_FOLDER%
echo.
echo Next steps:
echo 1. Review the folder to ensure all files are included
echo 2. Create a zip file: Right-click folder -^> Send to -^> Compressed folder
echo 3. Transfer zip to new computer
echo 4. Extract and follow SETUP_INSTRUCTIONS.md
echo.
echo ========================================
pause


