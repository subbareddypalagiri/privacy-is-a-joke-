@echo off
setlocal enabledelayedexpansion
title FUF SOVEREIGN MOBILE ANDROID BUILDER

cd /d "%~dp0"
cls
echo ======================================================================
echo   ___ _   _ _____     __  __  ___  ___ ___ _    ___ 
echo  ^| __^| ^| ^| ^| __/____^|  \/  ^|/ _ \^| _ )_ _^| ^|  ^| __^|
echo  ^| _^|^| ^|_^| ^| _^|_____^| ^|\/^| ^| (_) ^| _ \^| ^|^| ^|__^| _^| 
echo  ^|_^|   \___/_^|        ^|_^|  ^|_^|\___/^|___/___^|____^|___^|
echo   STANDALONE NATIVE ANDROID MOBILE APP BUILDER (CAPACITOR)
echo ======================================================================
echo.

echo [*] Step 1: Compiling Cyberpunk Dashboard & Defense Assets...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Web asset compilation failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [*] Step 2: Syncing Mobile Assets into Native Android Project...
call npx cap sync android
if %errorlevel% neq 0 (
    echo [ERROR] Capacitor Android sync failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [*] Step 3: Checking Android Build Environment (Gradle)...
if exist "android\gradlew.bat" (
    echo [OK] Native Android Studio project ready at: %~dp0android
    echo [*] Building Android APK package...
    cd android
    call gradlew.bat assembleDebug
    cd ..
    
    if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
        echo.
        echo ======================================================================
        echo 📱 SUCCESS! STANDALONE ANDROID APK GENERATED!
        echo Location: %~dp0android\app\build\outputs\apk\debug\app-debug.apk
        echo.
        echo INSTALLATION OPTIONS:
        echo 1. Connect phone via USB with USB Debugging enabled, then run:
        echo    adb install "%~dp0android\app\build\outputs\apk\debug\app-debug.apk"
        echo 2. Transfer "app-debug.apk" to your phone via WhatsApp/Telegram/Drive
        echo    and tap to install!
        echo ======================================================================
    ) else (
        echo.
        echo [INFO] Native Android project is ready!
        echo Open the "android" folder in Android Studio or run:
        echo   npx cap open android
        echo to build and run directly on your connected phone or emulator.
    )
) else (
    echo [ERROR] Android project wrapper not found. Run npx cap add android first.
)

echo.
pause
