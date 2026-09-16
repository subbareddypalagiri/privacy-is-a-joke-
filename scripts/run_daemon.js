/**
 * GhostShield Daemon Runner (Node ESM)
 */

import { GhostShieldLocalDaemon } from '../src/daemon/dns_server.ts';

const PORT = process.env.SHIELD_PORT ? parseInt(process.env.SHIELD_PORT) : 5353;
const daemon = new GhostShieldLocalDaemon(PORT);

console.log(`
  🛡️  ======================================================
     GHOSTSHIELD (PROJECT AEGIS) - LOCAL ON-DEVICE DAEMON
     Zero-Cost Cognitive Counter-Surveillance Engine
  ======================================================
`);

daemon.start()
  .then(() => {
    console.log(`
  [STATUS]      Online & Intercepting on 127.0.0.1:${PORT}
  [PROTECTION]  Whole Laptop Telemetry + Ad-ID Beacons Blocked
  [AI-POISON]   Active High-Entropy Behavioral Dispersion Active
  [BANK-SAFE]   Zone A Whitelist Auto-Bypass Engaged
    `);
  })
  .catch((err) => {
    console.error('❌ Daemon failed to bind port:', err);
  });
