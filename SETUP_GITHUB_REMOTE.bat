@echo off
echo ========================================
echo Connect to GitHub Repository
echo ========================================
echo.

REM Check if Git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git first from https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check if git repository exists
if not exist .git (
    echo ERROR: Not a Git repository!
    echo Please run SETUP_GITHUB.bat first
    pause
    exit /b 1
)

echo Enter your GitHub repository URL:
echo Example: https://github.com/YOUR_USERNAME/ai-closet-app.git
echo.
set /p REPO_URL="Repository URL: "

if "%REO_URL%"=="" (
    echo ERROR: Repository URL is required!
    pause
    exit /b 1
)

echo.
echo Adding remote repository...
git remote add origin %REPO_URL%
if %errorlevel% neq 0 (
    echo.
    echo Remote might already exist. Updating...
    git remote set-url origin %REPO_URL%
)

echo.
echo Setting branch to main...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo.
    echo Next steps:
    echo 1. Go to: https://github.com/YOUR_USERNAME/ai-closet-app/settings/pages
    echo 2. Source: GitHub Actions
    echo 3. Save
    echo 4. See DEPLOY.md for backend hosting
    echo.
    echo ========================================
) else (
    echo.
    echo ERROR: Failed to push to GitHub
    echo.
    echo Possible issues:
    echo - Repository doesn't exist on GitHub
    echo - Authentication required (use GitHub Desktop or GitHub CLI)
    echo - Check your repository URL
    echo.
    echo For authentication:
    echo 1. Use GitHub Desktop: https://desktop.github.com
    echo 2. Or use GitHub CLI: gh auth login
    echo.
)

pause


