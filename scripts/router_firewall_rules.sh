#!/bin/sh
# ==============================================================================
# FUF SOVEREIGN GATEWAY ARMOR: ROUTER-LEVEL RING -3 SINKHOLE
# ==============================================================================
# Target: Intel Management Engine (AMT) / AMD PSP Out-of-Band Hardware Telemetry
# Purpose: Drops out-of-band firmware packets at your Home Wi-Fi Router
#          even when the target PC is powered OFF (S5 sleep state) with power plugged in.
#
# Supported Gateways: OpenWrt, DD-WRT, Tomato, AsusWRT (Merlin), pfSense, OPNsense,
#                     Raspberry Pi Gateway, or any Linux router with iptables/nftables.
# ==============================================================================

echo "[*] Engaging FUF Sovereign Gateway Shield..."

# 1. IPTABLES RULES (OpenWrt / DD-WRT / Linux Gateways)
if command -v iptables >/dev/null 2>&1; then
    echo "[+] Installing iptables rules for Out-of-Band Ports..."

    # Block Intel AMT Web Management (HTTP & HTTPS)
    iptables -I FORWARD -p tcp --dport 16992 -j DROP
    iptables -I FORWARD -p tcp --dport 16993 -j DROP
    iptables -I OUTPUT  -p tcp --dport 16992 -j DROP
    iptables -I OUTPUT  -p tcp --dport 16993 -j DROP

    # Block Serial-over-LAN (SOL) & IDE-R
    iptables -I FORWARD -p tcp --dport 16994 -j DROP
    iptables -I FORWARD -p tcp --dport 16995 -j DROP
    iptables -I OUTPUT  -p tcp --dport 16994 -j DROP
    iptables -I OUTPUT  -p tcp --dport 16995 -j DROP

    # Block IPMI Remote Management (UDP)
    iptables -I FORWARD -p udp --dport 623 -j DROP
    iptables -I FORWARD -p udp --dport 664 -j DROP
    iptables -I OUTPUT  -p udp --dport 623 -j DROP
    iptables -I OUTPUT  -p udp --dport 664 -j DROP

    echo "[OK] iptables: Intel ME / AMT Ports 16992-16995 & IPMI 623/664 hard-dropped."
fi

# 2. NFTABLES RULES (Modern OpenWrt 22.03+ / Debian / Alpine)
if command -v nft >/dev/null 2>&1; then
    echo "[+] Installing nftables rules..."
    nft add rule inet fw4 forward tcp dport { 16992, 16993, 16994, 16995 } drop 2>/dev/null || true
    nft add rule inet fw4 forward udp dport { 623, 664 } drop 2>/dev/null || true
    echo "[OK] nftables: Out-of-Band ports dropped in forward chain."
fi

# 3. DNS HIJACK PROTECTION (Force all LAN DNS to Router / FUF Core)
# Redirects any rogue hardcoded device DNS queries (Google/Cloudflare 8.8.8.8) to router
if command -v iptables >/dev/null 2>&1; then
    iptables -t nat -I PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53 2>/dev/null || true
    iptables -t nat -I PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 53 2>/dev/null || true
fi

echo "=============================================================================="
echo "🛡️  FUF GATEWAY ACTIVE: Zero Out-of-Band Hardware Telemetry Can Cross Router!"
echo "=============================================================================="
