/**
 * FUF Institutional Daemon CLI Runner
 */

import { ProductionDnsEngine } from './dns_engine';

const PORT = process.env.SHIELD_PORT ? parseInt(process.env.SHIELD_PORT) : 53;
const engine = new ProductionDnsEngine(PORT);

console.log(`
  🛡️  =============================================================
     FUF (PROJECT AEGIS) - INSTITUTIONAL EDITION v3.0
     LRU Cache + Multi-Upstream Racing DoH + Shannon Graph Entropy
  =============================================================
`);

engine.start()
  .then(() => {
    console.log(`
  [STATUS]      🟢 ONLINE (Port ${PORT} Multi-Vector Socket Active)
  [CACHE]       ⚡ Zero-Latency In-Memory LRU Cache (< 0.05ms)
  [ENCRYPTION]  🔒 Multi-Upstream Racing DoH (Cloudflare / Quad9 / Mullvad)
  [PROTECTION]  🚫 150,000+ Suffix Radix Trie + CNAME Uncloaking Active
  [AI-POISON]   🧪 Shannon Graph Entropy H(X) Convergence Active
  [BANK-SAFE]   🏦 Zone A Whitelist Auto-Bypass Engaged

  Press Ctrl+C to stop the daemon.
    `);

    setInterval(() => {
      const s = engine.stats;
      process.stdout.write(`\r  📊 [INSTITUTIONAL METRICS] Total: ${s.totalQueries} | 🚫 Blocked: ${s.blockedQueries} | ⚡ Cached: ${s.cachedQueries} | 🔒 Encrypted: ${s.forwardedQueries} | 🧪 Entropy: ${s.shannonEntropyBits} Bits (${s.entropyPercentage}%) | RAM: ${s.memoryUsageMb}MB`);
    }, 4000);
  })
  .catch((err) => {
    console.error('❌ Failed to start FUF Institutional Engine:', err);
    process.exit(1);
  });

process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down FUF Institutional Engine gracefully...');
  engine.stop();
  process.exit(0);
});
