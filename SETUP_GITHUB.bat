@echo off
echo ========================================
echo GitHub Setup for AI Closet App
echo ========================================
echo.

REM Check if Git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Download from: https://git-scm.com/download/win
    echo 2. Install with default settings
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
)

echo Git is installed!
git --version
echo.

REM Check if already a git repository
if exist .git (
    echo This is already a Git repository.
    echo.
    git status
    echo.
    echo To set up GitHub:
    echo 1. Create a repository on GitHub.com
    echo 2. Copy the repository URL
    echo 3. Run: git remote add origin YOUR_REPO_URL
    echo 4. Run: git push -u origin main
    echo.
    pause
    exit /b 0
)

echo Initializing Git repository...
git init
echo.

echo Adding all files...
git add .
echo.

echo Creating initial commit...
git commit -m "Initial commit: AI Closet App"
echo.

echo ========================================
echo Git repository initialized!
echo.
echo Next steps:
echo 1. Go to https://github.com/new
echo 2. Create a new repository (name: ai-closet-app)
echo 3. DO NOT initialize with README
echo 4. Copy the repository URL
echo 5. Run: SETUP_GITHUB_REMOTE.bat
echo.
echo ========================================
pause


