/**
 * FUF Encrypted DNS-over-HTTPS (DoH) Client
 * Upstream resolver that tunnels all clean DNS queries over encrypted TLS (HTTPS)
 * Prevents local ISPs (Jio, Airtel, ACT, Comcast) from logging or snooping on browsing habits.
 */

import https from 'https';

const DOH_ENDPOINTS = [
  'https://cloudflare-dns.com/dns-query',
  'https://dns.quad9.net/dns-query',
];

export class DohClient {
  private agent: https.Agent;
  private endpointIndex: number = 0;

  constructor() {
    this.agent = new https.Agent({
      keepAlive: true,
      maxSockets: 64,
      timeout: 3000,
    });
  }

  public async resolve(dnsWirePacket: Buffer): Promise<Buffer> {
    const endpoint = DOH_ENDPOINTS[this.endpointIndex % DOH_ENDPOINTS.length];
    this.endpointIndex++;

    return new Promise((resolve, reject) => {
      const url = new URL(endpoint);

      const req = https.request(
        {
          hostname: url.hostname,
          path: url.pathname,
          method: 'POST',
          agent: this.agent,
          headers: {
            'Content-Type': 'application/dns-message',
            'Content-Length': dnsWirePacket.length,
            'Accept': 'application/dns-message',
          },
          timeout: 2500,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            if (res.statusCode === 200) {
              const fullBuffer = Buffer.concat(chunks);
              // Preserve original Transaction ID from client query packet (first 2 bytes)
              fullBuffer[0] = dnsWirePacket[0];
              fullBuffer[1] = dnsWirePacket[1];
              resolve(fullBuffer);
            } else {
              reject(new Error(`DoH upstream HTTP ${res.statusCode}`));
            }
          });
        }
      );

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('DoH upstream timeout'));
      });

      req.write(dnsWirePacket);
      req.end();
    });
  }
}
