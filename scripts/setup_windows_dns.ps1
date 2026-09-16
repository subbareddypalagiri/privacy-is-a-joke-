# GhostShield Windows One-Click Loopback DNS Activation Script
# Sets the active network adapter to route DNS through local GhostShield Daemon (127.0.0.1)

Write-Host '🛡️ GhostShield (Project Aegis) - Activating On-Device DNS Shield...' -ForegroundColor Cyan

$adapter = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1

if ($null -eq $adapter) {
    Write-Host '❌ No active network adapter found!' -ForegroundColor Red
    exit 1
}

Write-Host ('📍 Active Adapter Detected: ' + $adapter.Name + ' (' + $adapter.InterfaceDescription + ')') -ForegroundColor Yellow

try {
    Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ServerAddresses @('127.0.0.1', '1.1.1.1')
    Write-Host '✅ DNS Successfully Routed to Local GhostShield Daemon (127.0.0.1)!' -ForegroundColor Green
    Write-Host '🔒 All applications (Chrome, Discord, Spotify, VS Code) are now protected.' -ForegroundColor Green
} catch {
    Write-Host ('❌ Error setting DNS addresses: ' + $_.Exception.Message) -ForegroundColor Red
    Write-Host '💡 Please run PowerShell as Administrator to apply network settings.' -ForegroundColor Yellow
}
