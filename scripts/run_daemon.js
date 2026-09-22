/**
 * FUF Daemon Runner (Node ESM)
 */

import { ProductionDnsEngine } from '../src/daemon/dns_engine.ts';

const PORT = process.env.SHIELD_PORT ? parseInt(process.env.SHIELD_PORT) : 53;
const daemon = new ProductionDnsEngine(PORT);

console.log(`
  🛡️  ======================================================
     FUF (PROJECT AEGIS) - ULTRA ON-DEVICE DAEMON (v3.0)
     Zero-Leakage Multi-Vector Sovereign Defense Engine
  ======================================================
`);

daemon.start()
  .then(() => {
    console.log(`
  [STATUS]      🟢 Online & Intercepting on 127.0.0.1:${PORT} (UDP Standard DNS)
  [CONTROL API] ⚡ Running on http://127.0.0.1:5354 (Dashboard Sync)
  [MOBILE DOH]  📱 RFC 8484 Mobile Endpoint Ready: http://0.0.0.0:5354/dns-query
  [PROTECTION]  🛡️ 36-Vector Apex Defense (Meta, Criteo, AppsFlyer Sinkholed)
  [AI-POISON]   🧪 Fast Gradient Sign Method (FGSM) Cart Noise Active
  [BANK-SAFE]   🏦 Zone A Financial Whitelist Direct Pass Engaged
    `);
  })
  .catch((err) => {
    console.error('❌ Daemon failed to bind port:', err);
  });
