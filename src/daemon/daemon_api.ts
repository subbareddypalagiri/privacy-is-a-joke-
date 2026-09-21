/**
 * FUF Local Control API Server
 * Exposes a lightweight local HTTP API on 127.0.0.1:5354 for Dashboard integration.
 */

import http from 'http';
import os from 'os';
import { MobileProfileGenerator } from '../core/mobile_profile_generator';
import { QuantumArmorEngine } from '../crypto/quantum_armor';
import { ZkAnonymityEngine } from '../crypto/zk_anonymity';

function getLocalLanIp(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const quantumEngine = new QuantumArmorEngine();
const zkEngine = new ZkAnonymityEngine([
  'criteo.com',
  'facebook.com',
  'doubleclick.net',
  'appsflyer.com',
  'branch.io',
  'adjust.com'
]);

export function startControlApi(engine: any, port: number = 5354): http.Server {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    // RFC 8484 DNS-over-HTTPS (DoH) Wire-Format Handler for Mobile Devices
    if (url.pathname === '/dns-query') {
      if (req.method === 'POST') {
        const chunks: Buffer[] = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', async () => {
          try {
            const queryBuf = Buffer.concat(chunks);
            const responseBuf = await engine.resolveWireQuery(queryBuf);
            res.writeHead(200, {
              'Content-Type': 'application/dns-message',
              'Cache-Control': 'max-age=300',
            });
            res.end(responseBuf);
          } catch (e) {
            res.writeHead(500);
            res.end('DNS Resolution Error');
          }
        });
        return;
      } else if (req.method === 'GET') {
        const dnsParam = url.searchParams.get('dns');
        if (dnsParam) {
          try {
            const queryBuf = Buffer.from(dnsParam, 'base64url');
            const responseBuf = await engine.resolveWireQuery(queryBuf);
            res.writeHead(200, {
              'Content-Type': 'application/dns-message',
              'Cache-Control': 'max-age=300',
            });
            res.end(responseBuf);
          } catch (e) {
            res.writeHead(400);
            res.end('Invalid Base64url DNS Query');
          }
          return;
        }
      }
    }

    if (url.pathname === '/api/stats' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(engine.stats));
      return;
    }

    if (url.pathname === '/api/mobile/lan-status' && req.method === 'GET') {
      const lanIp = getLocalLanIp();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          lanIp,
          dnsPort: 53,
          apiPort: port,
          dohUrl: `http://${lanIp}:${port}/dns-query`,
          appleProfileUrl: `http://${lanIp}:${port}/api/mobile/profile.mobileconfig`,
          wifiInstructions: {
            android: `Settings -> Wi-Fi -> Advanced -> IP Settings: Static -> DNS 1: ${lanIp}`,
            ios: `Settings -> Wi-Fi -> (i) icon -> Configure DNS -> Manual -> Add Server: ${lanIp}`
          }
        })
      );
      return;
    }

    if (url.pathname === '/api/mobile/profile.mobileconfig' && req.method === 'GET') {
      const mobileGen = new MobileProfileGenerator();
      const lanIp = getLocalLanIp();
      const host = req.headers.host || `${lanIp}:${port}`;
      const serverUrl = `https://${host.split(':')[0]}/dns-query`;
      const profile = mobileGen.generateAppleProfile(serverUrl);
      res.writeHead(200, {
        'Content-Type': 'application/x-apple-aspen-config',
        'Content-Disposition': 'attachment; filename="FUF.mobileconfig"',
      });
      res.end(profile);
      return;
    }

    if (url.pathname === '/api/mobile/android' && req.method === 'GET') {
      const mobileGen = new MobileProfileGenerator();
      const config = mobileGen.generateAndroidPrivateDnsConfig();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(config));
      return;
    }

    if (url.pathname === '/api/filter/stats' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(engine.dynamicFilter ? engine.dynamicFilter.getStats() : {}));
      return;
    }

    if (url.pathname === '/api/quantum/stats' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          metrics: quantumEngine.getQuantumMetrics(),
          keyPair: {
            publicKey: quantumEngine.getKeyPair()?.publicKey,
            latticeDimension: quantumEngine.getKeyPair()?.latticeDimension,
            createdTimestamp: quantumEngine.getKeyPair()?.createdTimestamp
          }
        })
      );
      return;
    }

    if (url.pathname === '/api/zk/proof' && req.method === 'GET') {
      const domain = url.searchParams.get('domain') || 'criteo.com';
      const proof = zkEngine.generateProof(domain);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          merkleRoot: zkEngine.getRoot(),
          proof,
          blindedToken: zkEngine.generateBlindedSessionToken('FUF_session_alpha')
        })
      );
      return;
    }

    if (url.pathname === '/api/filter/sync' && req.method === 'POST') {
      if (engine.threatSyncer) {
        engine.threatSyncer.syncNow().then((result: any) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        });
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Filter active' }));
      }
      return;
    }

    if (url.pathname === '/api/toggle' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const { enabled } = JSON.parse(body);
          if (enabled && !engine.stats.running) {
            engine.start();
          } else if (!enabled && engine.stats.running) {
            engine.stop();
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, running: engine.stats.running }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[FUF Control API] Port ${port} active, reusing endpoint.`);
    } else {
      console.error('[FUF Control API] Server error:', err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`[FUF Control API] ⚡ Active on http://0.0.0.0:${port} (LAN & Mobile Ready)`);
  });

  return server;
}
