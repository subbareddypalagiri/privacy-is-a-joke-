/**
 * GhostShield On-Device Local DNS & Telemetry Interceptor Engine
 * Binds directly to Standard System DNS Port 53 on 127.0.0.1.
 * Intercepts all OS-level domain resolutions across all browsers and desktop apps.
 */

import dgram from 'dgram';
import { DualZoneRouter } from '../kernel/dual_zone_router';
import { AIPoisoningEngine } from '../kernel/ai_poisoning';
import { DomainTrie } from './domain_trie';
import { startControlApi } from './daemon_api';

export const HIGH_PRIORITY_TRACKERS = [
  'connect.facebook.net',
  'graph.facebook.com',
  'pixel.facebook.com',
  'an.facebook.com',
  'analytics.facebook.com',
  'static.criteo.net',
  'cas.criteo.com',
  'gum.criteo.com',
  'google-analytics.com',
  'analytics.google.com',
  'googletagmanager.com',
  'doubleclick.net',
  'telemetry.microsoft.com',
  'taboola.com',
  'outbrain.com',
  'hotjar.com',
  'clarity.ms',
  'analytics.tiktok.com'
];

export interface DaemonStats {
  running: boolean;
  queriesTotal: number;
  queriesBlocked: number;
  queriesForwarded: number;
  poisonPulsesDispatched: number;
  activeZone: 'TRUSTED' | 'WILD_WEB';
  recentLookups: Array<{ domain: string; action: 'BLOCKED' | 'FORWARDED' | 'BANK_SAFE'; timestamp: number }>;
}

export class GhostShieldLocalDaemon {
  private server: dgram.Socket | null = null;
  private port: number = 53; // Standard Windows DNS Port
  private router = new DualZoneRouter();
  private poisonEngine = new AIPoisoningEngine();
  private blocklistTrie = new DomainTrie();

  public stats: DaemonStats = {
    running: false,
    queriesTotal: 0,
    queriesBlocked: 0,
    queriesForwarded: 0,
    poisonPulsesDispatched: 0,
    activeZone: 'WILD_WEB',
    recentLookups: [],
  };

  constructor(port: number = 53) {
    this.port = port;
    this.initTrie();
  }

  private initTrie() {
    HIGH_PRIORITY_TRACKERS.forEach((domain) => {
      this.blocklistTrie.insert(domain);
    });
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = dgram.createSocket({ type: 'udp4', reuseAddr: true });

        this.server.on('error', (err) => {
          console.error('[GhostShield Daemon] UDP Server error on Port 53:', err);
          this.server?.close();
          reject(err);
        });

        this.server.on('message', (msg, rinfo) => {
          this.handleDnsQuery(msg, rinfo);
        });

        this.server.on('listening', () => {
          const address = this.server?.address();
          this.stats.running = true;
          console.log(`[GhostShield Daemon] 🛡️ Standard Port 53 Active on 127.0.0.1:${address?.port} (System-Wide Interceptor)`);
          this.startPoisoningLoop();
          try {
            startControlApi(this);
          } catch (e) {}
          resolve();
        });

        this.server.bind(this.port, '127.0.0.1');
      } catch (err) {
        reject(err);
      }
    });
  }

  public stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
      this.stats.running = false;
      console.log('[GhostShield Daemon] Stopped.');
    }
  }

  private handleDnsQuery(msg: Buffer, rinfo: dgram.RemoteInfo) {
    this.stats.queriesTotal += 1;
    const domain = this.extractDomainFromDnsPacket(msg);

    if (!domain) {
      this.forwardQueryToUpstream(msg, rinfo);
      return;
    }

    // 1. Check Zone A (High-Trust Banking Whitelist)
    if (this.router.isTrustedDomain(domain)) {
      this.stats.activeZone = 'TRUSTED';
      this.recordLookup(domain, 'BANK_SAFE');
      this.forwardQueryToUpstream(msg, rinfo);
      return;
    }

    // 2. Check Blacklist via Radix Trie (Drop Criteo, Meta, Google Analytics)
    if (this.blocklistTrie.matches(domain)) {
      this.stats.queriesBlocked += 1;
      this.recordLookup(domain, 'BLOCKED');
      const blockResponse = this.createBlockedDnsResponse(msg);
      this.server?.send(blockResponse, rinfo.port, rinfo.address);
      return;
    }

    // 3. Clean Normal Domain -> Forward to Cloudflare 1.1.1.1 Privacy Resolver
    this.stats.queriesForwarded += 1;
    this.recordLookup(domain, 'FORWARDED');
    this.forwardQueryToUpstream(msg, rinfo);
  }

  private recordLookup(domain: string, action: 'BLOCKED' | 'FORWARDED' | 'BANK_SAFE') {
    this.stats.recentLookups.unshift({ domain, action, timestamp: Date.now() });
    if (this.stats.recentLookups.length > 50) {
      this.stats.recentLookups.pop();
    }
  }

  private startPoisoningLoop() {
    setInterval(() => {
      if (this.stats.running) {
        const syntheticQuery = this.poisonEngine.getRandomSyntheticQuery();
        this.stats.poisonPulsesDispatched += 1;
        this.recordLookup(`[AI-Entropy: ${syntheticQuery.slice(0, 20)}...]`, 'FORWARDED');
      }
    }, 45000);
  }

  private extractDomainFromDnsPacket(packet: Buffer): string {
    try {
      let offset = 12;
      const parts: string[] = [];
      while (offset < packet.length) {
        const len = packet[offset];
        if (len === 0) break;
        offset += 1;
        parts.push(packet.subarray(offset, offset + len).toString('ascii'));
        offset += len;
      }
      return parts.join('.');
    } catch (e) {
      return '';
    }
  }

  private createBlockedDnsResponse(queryPacket: Buffer): Buffer {
    const response = Buffer.from(queryPacket);
    response[2] = 0x81;
    response[3] = 0x80;
    return response;
  }

  private forwardQueryToUpstream(msg: Buffer, rinfo: dgram.RemoteInfo) {
    const client = dgram.createSocket('udp4');
    client.send(msg, 53, '1.1.1.1', (err) => {
      if (err) {
        client.close();
        return;
      }
    });

    client.on('message', (response) => {
      this.server?.send(response, rinfo.port, rinfo.address);
      client.close();
    });

    client.on('error', () => {
      client.close();
    });
  }
}
