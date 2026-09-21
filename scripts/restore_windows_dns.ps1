# FUF Windows One-Click DNS Restore Script
# Restores the active network adapter back to automatic DHCP DNS configuration.

Write-Host "🔄 FUF - Restoring Network DNS to Automatic DHCP..." -ForegroundColor Cyan

$adapter = Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Select-Object -First 1

if ($null -eq $adapter) {
    Write-Host "❌ No active network adapter found!" -ForegroundColor Red
    exit 1
}

try {
    Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ResetServerAddresses
    Write-Host "✅ Network DNS restored to automatic DHCP defaults." -ForegroundColor Green
} catch {
    Write-Host "❌ Error resetting DNS: $_" -ForegroundColor Red
}
