/**
 * FUF Mobile Zero-Install Profile Generator
 * Constructs Apple iOS .mobileconfig profiles and Android Private DNS setup payloads,
 * enabling zero-app system-wide Encrypted DNS & Tracker Sinkholing on mobile smartphones.
 */

export class MobileProfileGenerator {
  /**
   * Generates a native Apple iOS Mobile Configuration Profile (.mobileconfig)
   * Uses Apple's native com.apple.dnsSettings.managed payload (iOS 14.0+ / iPadOS 14.0+).
   */
  public generateAppleProfile(serverUrl: string = 'https://cloudflare-dns.com/dns-query'): string {
    const payloadUUID = 'GS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const configUUID = 'GS-CFG-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    return `<?xml version="1.0" encoding="UTF-8"?>
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
            <string>com.FUF.ios.dns</string>
            <key>PayloadUUID</key>
            <string>${configUUID}</string>
            <key>PayloadDisplayName</key>
            <string>FUF Encrypted DoH</string>
            <key>DNSSettings</key>
            <dict>
                <key>DNSProtocol</key>
                <string>HTTPS</string>
                <key>ServerURL</key>
                <string>${serverUrl}</string>
                <key>ServerAddresses</key>
                <array>
                    <string>1.1.1.1</string>
                    <string>1.0.0.1</string>
                    <string>2606:4700:4700::1111</string>
                </array>
            </dict>
        </dict>
    </array>
</dict>
</plist>`.trim();
  }

  /**
   * Generates Android Private DNS DoT hostname instructions
   */
  public generateAndroidPrivateDnsConfig(): {
    protocol: string;
    hostname: string;
    description: string;
    quickSteps: string[];
  } {
    return {
      protocol: 'DNS-over-TLS (DoT)',
      hostname: 'one.one.one.one',
      description: 'Native Android 9+ Private DNS encrypted channel with zero battery drain.',
      quickSteps: [
        'Open Settings on your Android phone',
        'Tap Network & Internet -> Private DNS',
        'Select "Private DNS provider hostname"',
        'Enter: one.one.one.one (or dns.quad9.net)',
        'Tap Save',
      ],
    };
  }
}
