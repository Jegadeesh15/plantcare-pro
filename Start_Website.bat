@echo off
title PlantCare Pro Server

echo ===========================================
echo       Starting PlantCare Pro Website       
echo ===========================================
echo.

cd /d "%~dp0"

echo [1/2] Activating virtual environment...
if exist ".venv\Scripts\activate.bat" (
    call ".venv\Scripts\activate.bat"
) else (
    echo [ERROR] Virtual environment not found at .venv!
    echo Please make sure you have created it and installed dependencies.
    pause
    exit /b 1
)

echo [2/2] Starting the backend server (which also serves the frontend)...
cd backend
python main.py

pause
