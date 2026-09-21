/**
 * FUF Client-Side Universal Download Helpers
 * Works 100% offline and on static hosts like Vercel without requiring localhost server.
 */

export function downloadIosMobileconfig() {
  const payloadUUID = 'FUF-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const configUUID = 'FUF-CFG-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadDisplayName</key>
    <string>FUF Sovereign Mobile Armor</string>
    <key>PayloadDescription</key>
    <string>Zero-Latency Encrypted DNS & Tracking Sinkhole for iOS / iPadOS</string>
    <key>PayloadOrganization</key>
    <string>FUF Privacy Project</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${payloadUUID}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.dnsSettings.managed</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>com.fuf.ios.dns</string>
            <key>PayloadUUID</key>
            <string>${configUUID}</string>
            <key>PayloadDisplayName</key>
            <string>FUF Encrypted DoH</string>
            <key>DNSSettings</key>
            <dict>
                <key>DNSProtocol</key>
                <string>HTTPS</string>
                <key>ServerURL</key>
                <string>https://security.cloudflare-dns.com/dns-query</string>
                <key>ServerAddresses</key>
                <array>
                    <string>1.1.1.2</string>
                    <string>1.0.0.2</string>
                    <string>2606:4700:4700::1112</string>
                    <string>2606:4700:4700::1002</string>
                </array>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;

  const blob = new Blob([xml], { type: 'application/x-apple-aspen-config' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FUF-Sovereign-Armor.mobileconfig';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadWindowsZip() {
  const a = document.createElement('a');
  a.href = '/downloads/FUF-Windows-OneClick.zip';
  a.download = 'FUF-Windows-OneClick.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadExtensionZip() {
  const a = document.createElement('a');
  a.href = '/downloads/FUF-Chrome-Extension.zip';
  a.download = 'FUF-Chrome-Extension.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export const ANDROID_RECOMMENDED_DOT = 'dns.adguard-dns.com';
export const ANDROID_FALLBACK_DOT = 'security.cloudflare-dns.com';
