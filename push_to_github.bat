@echo off
echo ===================================================
echo  SriVoraTech - Git Push Automation
echo ===================================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    pause
    exit /b
)

REM Initialize repository if not already initialized
if not exist ".git" (
    echo [INFO] Initializing Git repository...
    git init
) else (
    echo [INFO] Git repository already initialized.
)

echo [INFO] Adding files to commit...
git add .

echo [INFO] Committing changes...
git commit -m "Initial commit: SriVoraTech Platform"

echo [INFO] Setting branch to main...
git branch -M main

echo [INFO] Adding remote origin...
git remote remove origin >nul 2>nul
git remote add origin https://github.com/srivoratech9/srivoratech.git

echo [INFO] Pushing repository to GitHub...
git push -u origin main

echo.
echo ===================================================
echo  Push complete! Verify at:
echo  https://github.com/srivoratech9/srivoratech
echo ===================================================
pause
