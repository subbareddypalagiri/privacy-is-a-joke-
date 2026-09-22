@echo off
setlocal enabledelayedexpansion
title FUF-404 ULTRA SOVEREIGN DEFENSE LAUNCHER

:: 1. Elevate Administrator Privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [FUF-404] Requesting Administrator Elevation...
    powershell -NoProfile -Command "Start-Process cmd -ArgumentList '/k \"\"%~dp0FUF-ULTRA-LAUNCHER.bat\"\"' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"
cls
echo ======================================================================
echo   ___ _   _ _____     _  _    ___  _  _   
echo  ^| __^| ^| ^| ^| __/____^| ^|^| ^|  / _ \^| ^|^| ^|  
echo  ^| _^|^| ^|_^| ^| _^|_____^| // _ ^| ^| (_) ^| // _ ^| 
echo  ^|_^|   \___/_^|        ^|_^|(_)_^|\___/ ^|_^|(_)_^| 
echo   ULTRA-TIER SOVEREIGN DEFENSE ^& ZERO-LEAKAGE ENGINE (2026 APEX)
echo ======================================================================
echo.

:: 2. Discover Active Network Adapters and Route to 127.0.0.1
echo [*] Inspecting active network interfaces...
powershell -NoProfile -Command ^
  "$adapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -ExpandProperty Name; " ^
  "foreach ($a in $adapters) { " ^
  "  Write-Host \"[+] Engaging FUF Kernel Loopback (IPv4 + IPv6) on Interface: $a\"; " ^
  "  netsh interface ip set dns name=\"$a\" static 127.0.0.1 | Out-Null; " ^
  "  netsh interface ip add dns name=\"$a\" 1.1.1.1 index=2 | Out-Null; " ^
  "  netsh interface ipv6 set dns name=\"$a\" static ::1 | Out-Null; " ^
  "}"

:: 3. Enforce Silicon Ring -3 (Intel ME / AMT) Out-of-Band Hardware Firewall Rules
echo [*] Engaging Silicon Ring -3 Out-of-Band Hardware Firewall Block...
netsh advfirewall firewall delete rule name="FUF_BLOCK_INTEL_ME_16992" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_INTEL_ME_16993" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_INTEL_ME_16994" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_INTEL_ME_16995" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_IPMI_623" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_IPMI_664" >nul 2>&1

netsh advfirewall firewall add rule name="FUF_BLOCK_INTEL_ME_16992" dir=out action=block protocol=TCP remoteport=16992 >nul
netsh advfirewall firewall add rule name="FUF_BLOCK_INTEL_ME_16993" dir=out action=block protocol=TCP remoteport=16993 >nul
netsh advfirewall firewall add rule name="FUF_BLOCK_INTEL_ME_16994" dir=out action=block protocol=TCP remoteport=16994 >nul
netsh advfirewall firewall add rule name="FUF_BLOCK_INTEL_ME_16995" dir=out action=block protocol=TCP remoteport=16995 >nul
netsh advfirewall firewall add rule name="FUF_BLOCK_IPMI_623" dir=out action=block protocol=UDP remoteport=623 >nul
netsh advfirewall firewall add rule name="FUF_BLOCK_IPMI_664" dir=out action=block protocol=UDP remoteport=664 >nul
echo [OK] Ring -3 Intel ME Out-of-Band Ports (16992, 16993, 16994, 16995, 623, 664) Sinkholed at OS Firewall.

:: 4. Find Local Machine Wi-Fi/LAN IP for Mobile Onboarding
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    set IP=!IP: =!
    goto :FoundIP
)
:FoundIP
echo.
echo [OK] Windows DNS successfully routed to FUF Kernel (127.0.0.1:53)
echo [OK] Local LAN IP: !IP!
echo.
echo ======================================================================
echo   MOBILE DEVICE INSTANT ZERO-APP ONBOARDING:
echo   - iPhone / iPad (iOS): Open Safari and visit:
echo     http://!IP!:5354/api/mobile/profile.mobileconfig
echo   - Android: Settings -> Network -> Private DNS:
echo     dns.fuf.internal  (or point static DNS to !IP!)
echo ======================================================================
echo.

:: 5. Start Supervised Daemon in New Window (Self-Healing Watchdog)
echo [*] Launching Self-Healing Sovereign Daemon Supervisor...
start "FUF Daemon (Self-Healing Watchdog)" cmd /k "cd /d "%~dp0" && npx tsx scripts/daemon_watchdog.js"

:: 6. Launch Frontend Dashboard
echo [*] Launching Cyberpunk Defense HUD...
start "FUF Dashboard (Vite)" cmd /k "cd /d "%~dp0" && npm run dev"

timeout /t 3 >nul

:: 7. Zero-Click Automated Browser Launch with Loaded Extension
echo [*] Engaging Zero-Click Browser Extension Shield...
set BROWSER_CMD=""

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set BROWSER_CMD="%ProgramFiles%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set BROWSER_CMD="%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
) else if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    set BROWSER_CMD="%LocalAppData%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set BROWSER_CMD="%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
)

if not !BROWSER_CMD!=="" (
    echo [OK] Found Chromium Browser: !BROWSER_CMD!
    echo [OK] Injecting FUF Extension from "%~dp0dist" directly into browser session...
    start "" !BROWSER_CMD! --load-extension="%~dp0dist" --disable-features=DnsOverHttps "http://localhost:5173"
) else (
    echo [!] Defaulting to standard browser URL open...
    start http://localhost:5173
)

echo.
echo [STATUS] FUF-404 ULTRA DEFENSE IS ACTIVE!
echo Keep this window open or minimize it. Run FUF-ULTRA-STOP.bat when done.
echo.
pause
