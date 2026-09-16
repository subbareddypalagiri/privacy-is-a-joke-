@echo off
echo ========================================================
echo   GhostShield - Restore Windows DNS to DHCP Defaults
echo ========================================================

netsh interface ip set dns name="Wi-Fi" dhcp

echo [SUCCESS] Network DNS successfully restored to automatic DHCP defaults.
pause
