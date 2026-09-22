@echo off
setlocal enabledelayedexpansion
title FUF-404 ULTRA - RESTORE TO DEFAULT (DHCP)

:: 1. Elevate Administrator Privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [FUF-404] Requesting Administrator Elevation...
    powershell -NoProfile -Command "Start-Process cmd -ArgumentList '/k \"\"%~dp0FUF-ULTRA-STOP.bat\"\"' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"
cls
echo ======================================================================
echo   FUF-404 - RESTORING STANDARD NETWORK CONFIGURATION (DHCP)
echo ======================================================================
echo.

powershell -NoProfile -Command ^
  "$adapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -ExpandProperty Name; " ^
  "foreach ($a in $adapters) { " ^
  "  Write-Host \"[*] Restoring Interface to ISP DHCP (IPv4 + IPv6): $a\"; " ^
  "  netsh interface ip set dns name=\"$a\" source=dhcp | Out-Null; " ^
  "  netsh interface ipv6 set dns name=\"$a\" source=dhcp | Out-Null; " ^
  "}"

echo [*] Removing Ring -3 Intel ME Hardware Firewall Blocks...
netsh advfirewall firewall delete rule name="FUF_BLOCK_INTEL_ME_16992" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_INTEL_ME_16993" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_INTEL_ME_16994" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_INTEL_ME_16995" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_IPMI_623" >nul 2>&1
netsh advfirewall firewall delete rule name="FUF_BLOCK_IPMI_664" >nul 2>&1
echo [OK] Firewall rules disengaged.

echo.
echo [SUCCESS] Windows DNS restored to default router/ISP DHCP.
echo FUF-404 Loopback has been safely disengaged.
echo.
pause
