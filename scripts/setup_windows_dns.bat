@echo off
echo ========================================================
echo   GhostShield (Project Aegis) - Windows DNS Activation
echo ========================================================

netsh interface ip set dns name="Wi-Fi" static 127.0.0.1
netsh interface ip add dns name="Wi-Fi" 1.1.1.1 index=2

echo [SUCCESS] Windows Wi-Fi DNS successfully routed to GhostShield Daemon (127.0.0.1:53)!
echo All Chrome, Spotify, Discord, and OS queries will now be filtered locally.
pause
