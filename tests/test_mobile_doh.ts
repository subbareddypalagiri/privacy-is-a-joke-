import { ProductionDnsEngine } from '../src/daemon/dns_engine';
import { startControlApi } from '../src/daemon/daemon_api';
import http from 'http';

async function testMobileDohAndApi() {
  console.log('Testing Mobile DoH & Control API on port 5359...');
  const engine = new ProductionDnsEngine(5359);
  const server = startControlApi(engine, 5359);

  await new Promise(r => setTimeout(r, 600));

  // 1. Test LAN Status endpoint
  const lanRes = await fetch('http://127.0.0.1:5359/api/mobile/lan-status');
  const lanData = await lanRes.json();
  console.log('LAN Status Response:', lanData);
  if (!lanData.lanIp || !lanData.dohUrl) {
    throw new Error('LAN Status failed');
  }

  // 2. Test Mobile .mobileconfig endpoint
  const profileRes = await fetch('http://127.0.0.1:5359/api/mobile/profile.mobileconfig');
  const profileXml = await profileRes.text();
  console.log('Profile Content Type:', profileRes.headers.get('content-type'));
  if (!profileXml.includes('com.apple.dnsSettings.managed')) {
    throw new Error('Apple mobileconfig payload missing');
  }

  // 3. Test RFC 8484 DoH POST wire query for a blocked tracker (e.g. static.criteo.net)
  // Construct a minimal DNS query packet for static.criteo.net (A record)
  // Header: ID=0x1234, Flags=0x0100 (standard query, RD=1), QDCOUNT=1, ANCOUNT=0, NSCOUNT=0, ARCOUNT=0
  const header = Buffer.from([0x12, 0x34, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  // QNAME: 6 static 6 criteo 3 net 0
  const qname = Buffer.from([
    6, 115, 116, 97, 116, 105, 99,
    6, 99, 114, 105, 116, 101, 111,
    3, 110, 101, 116,
    0
  ]);
  const qtypeClass = Buffer.from([0x00, 0x01, 0x00, 0x01]); // Type A, Class IN
  const queryPacket = Buffer.concat([header, qname, qtypeClass]);

  const dohRes = await fetch('http://127.0.0.1:5359/dns-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/dns-message' },
    body: queryPacket,
  });

  const responseBytes = Buffer.from(await dohRes.arrayBuffer());
  console.log('DoH Response length:', responseBytes.length);
  console.log('DoH Response Flags:', responseBytes[2].toString(16), responseBytes[3].toString(16));
  // QR bit should be 1 (0x8180)
  if ((responseBytes[2] & 0x80) === 0) {
    throw new Error('DoH response is not a valid DNS response packet');
  }

  server.close();
  console.log('✅ ALL MOBILE DOH & LAN TESTS PASSED 100%!');
  process.exit(0);
}

testMobileDohAndApi().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
