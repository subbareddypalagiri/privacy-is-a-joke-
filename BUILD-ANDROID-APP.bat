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
echo   Includes: 1-Tap On-Device VpnService Loopback & 45-Vector Shield
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
    echo [*] Compiling Android APK packages (Debug and Release)...
    cd android
    call gradlew.bat assembleDebug
    cd ..
    
    if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
        if not exist "public\downloads" mkdir "public\downloads"
        copy /y "android\app\build\outputs\apk\debug\app-debug.apk" "public\downloads\FUF-Sovereign-v1.0.0.apk" >nul
        if not exist "dist\downloads" mkdir "dist\downloads"
        copy /y "android\app\build\outputs\apk\debug\app-debug.apk" "dist\downloads\FUF-Sovereign-v1.0.0.apk" >nul

        echo.
        echo ======================================================================
        echo 📱 SUCCESS! STANDALONE ANDROID APK GENERATED & SYNCED TO DOWNLOADS!
        echo APK File: %~dp0android\app\build\outputs\apk\debug\app-debug.apk
        echo Web Asset: %~dp0public\downloads\FUF-Sovereign-v1.0.0.apk
        echo.
        echo FEATURES INCLUDED:
        echo - 1-Tap On-Device VpnService Loopback for 4G/5G Cellular Data
        echo - Zero-Install Private DNS Hostname Mode
        echo - 45-Vector Real-Time Decoupling Matrix (Flipkart, Swiggy, Amazon)
        echo.
        echo INSTALLATION OPTIONS:
        echo 1. Connect phone via USB with USB Debugging enabled, then run:
        echo    adb install "%~dp0android\app\build\outputs\apk\debug\app-debug.apk"
        echo 2. Transfer "FUF-Sovereign-v1.0.0.apk" to your phone via WhatsApp/Telegram
        echo    and tap to install!
        echo ======================================================================
    ) else (
        echo.
        echo [INFO] Native Android project is synchronized!
        echo Run 'npx cap open android' to build and run in Android Studio.
    )
) else (
    echo [ERROR] android\gradlew.bat not found. Run 'npx cap add android' first.
)

echo.
pause
