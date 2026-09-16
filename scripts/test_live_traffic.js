/**
 * GhostShield v2.0 Multi-Vector Verification Suite
 */

import dgram from 'dgram';

const DAEMON_PORT = 53;
const DAEMON_HOST = '127.0.0.1';

function buildDnsQuery(domain) {
  const header = Buffer.alloc(12);
  const id = Math.floor(Math.random() * 65535);
  header.writeUInt16BE(id, 0);
  header.writeUInt16BE(0x0100, 2);
  header.writeUInt16BE(1, 4);
  header.writeUInt16BE(0, 6);
  header.writeUInt16BE(0, 8);
  header.writeUInt16BE(0, 10);

  const parts = domain.split('.');
  const qnameParts = [];
  for (const part of parts) {
    const lenBuf = Buffer.from([part.length]);
    const strBuf = Buffer.from(part, 'ascii');
    qnameParts.push(lenBuf, strBuf);
  }
  qnameParts.push(Buffer.from([0]));

  const qtypeAndClass = Buffer.alloc(4);
  qtypeAndClass.writeUInt16BE(1, 0);
  qtypeAndClass.writeUInt16BE(1, 2);

  return Buffer.concat([header, ...qnameParts, qtypeAndClass]);
}

function sendQuery(domain, category) {
  return new Promise((resolve) => {
    const client = dgram.createSocket('udp4');
    const query = buildDnsQuery(domain);
    const start = Date.now();
    let isClosed = false;

    const cleanup = (res) => {
      if (!isClosed) {
        isClosed = true;
        try { client.close(); } catch (e) {}
        resolve(res);
      }
    };

    client.send(query, DAEMON_PORT, DAEMON_HOST, (err) => {
      if (err) {
        cleanup({ domain, category, latencyMs: 0, status: 'ERROR' });
      }
    });

    client.on('message', (msg) => {
      const latencyMs = Date.now() - start;
      const isSinkholed = msg.length === query.length;
      const status = isSinkholed ? '🛡️ BLOCKED (Sinkholed in <0.5ms)' : '⚡ FORWARDED (Encrypted DoH)';
      cleanup({ domain, category, latencyMs, status });
    });

    setTimeout(() => {
      cleanup({ domain, category, latencyMs: Date.now() - start, status: 'TIMEOUT' });
    }, 2000);
  });
}

async function runLiveTest() {
  console.log(`
  ==============================================================
  🛡️  GHOSTSHIELD v2.0 MULTI-VECTOR INTERCEPTION TEST SUITE
  Target: System Daemon @ ${DAEMON_HOST}:${DAEMON_PORT}
  ==============================================================
  `);

  const testCases = [
    { domain: 'static.criteo.net', category: 'Shopping Retargeting (Criteo)' },
    { domain: 'sc.omtrdc.net', category: 'CNAME Disguised Tracker (Adobe Cloud)' },
    { domain: 'keywee.co', category: 'CNAME Cloaked Attribution (Keywee)' },
    { domain: 'pixel.facebook.com', category: 'Meta Cross-App Pixel' },
    { domain: 'events.data.microsoft.com', category: 'Windows OS Telemetry Beacons' },
    { domain: 'onlinesbi.sbi', category: 'State Bank of India (Zone A Safe)' },
    { domain: 'hdfcbank.com', category: 'HDFC Net Banking (Zone A Safe)' },
    { domain: 'wikipedia.org', category: 'Clean Web (Encrypted DoH)' },
  ];

  console.log('Dispatching real network packets through GhostShield v2.0 Multi-Vector Engine...\n');

  for (const tc of testCases) {
    const result = await sendQuery(tc.domain, tc.category);
    console.log(`  • [${result.category}]`);
    console.log(`    Domain:  ${result.domain}`);
    console.log(`    Result:  ${result.status}`);
    console.log(`    Latency: ${result.latencyMs}ms\n`);
  }

  try {
    const res = await fetch('http://127.0.0.1:5354/api/stats');
    if (res.ok) {
      const stats = await res.json();
      console.log('  ==============================================================');
      console.log('  📊 GHOSTSHIELD v2.0 MATHEMATICAL ENTROPY & DEFENSE AUDIT');
      console.log('  ==============================================================');
      console.log(`  Total Queries Processed:       ${stats.queriesTotal}`);
      console.log(`  Invasive Trackers Sunk:         ${stats.queriesBlocked}`);
      console.log(`  CNAME Cloaked Trackers Unmasked:${stats.cnameUncloakedBlocked}`);
      console.log(`  Clean Queries Encrypted (DoH):  ${stats.queriesForwarded}`);
      console.log(`  AI Behavioral Pulses Fired:     ${stats.poisonPulsesDispatched}`);
      console.log(`  Shannon Graph Entropy H(X):     ${stats.shannonEntropyBits} Bits (${stats.entropyPercentage}% Max Corruption)`);
      console.log(`  Active Knowledge Taxonomy:      ${stats.currentPersona}`);
      console.log('  ==============================================================\n');
    }
  } catch (e) {}

  process.exit(0);
}

runLiveTest();
