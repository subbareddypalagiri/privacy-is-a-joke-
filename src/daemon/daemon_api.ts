/**
 * GhostShield Local Control API Server
 * Exposes a lightweight local HTTP API on 127.0.0.1:5354 for Dashboard integration.
 */

import http from 'http';
import { MobileProfileGenerator } from '../core/mobile_profile_generator';
import { QuantumArmorEngine } from '../crypto/quantum_armor';
import { ZkAnonymityEngine } from '../crypto/zk_anonymity';

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
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    if (url.pathname === '/api/stats' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(engine.stats));
      return;
    }

    if (url.pathname === '/api/mobile/profile.mobileconfig' && req.method === 'GET') {
      const mobileGen = new MobileProfileGenerator();
      const profile = mobileGen.generateAppleProfile();
      res.writeHead(200, {
        'Content-Type': 'application/x-apple-aspen-config',
        'Content-Disposition': 'attachment; filename="ghostshield.mobileconfig"',
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
          blindedToken: zkEngine.generateBlindedSessionToken('ghostshield_session_alpha')
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
      console.log(`[GhostShield Control API] Port ${port} active, reusing endpoint.`);
    } else {
      console.error('[GhostShield Control API] Server error:', err);
    }
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`[GhostShield Control API] ⚡ Active on http://127.0.0.1:${port}`);
  });

  return server;
}
