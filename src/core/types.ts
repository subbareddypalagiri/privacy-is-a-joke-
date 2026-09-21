/**
 * FUF Industrial Strict Type Definitions
 * Fully typed, zero 'any' policy for institutional-grade reliability.
 */

export type DomainName = string;
export type IpAddress = string;
export type Milliseconds = number;

export type SecurityZone = 'ZONE_A_FINANCIAL' | 'ZONE_B_ENCRYPTED' | 'ZONE_SINKHOLE';

export type LookupAction = 
  | 'BLOCKED_ADTECH'
  | 'BLOCKED_CNAME_CLOAK'
  | 'BLOCKED_TELEMETRY'
  | 'FORWARDED_DOH'
  | 'FORWARDED_CACHE_HIT'
  | 'BANKING_SAFE_ROUTE';

export interface DnsRecordEntry {
  domain: DomainName;
  packet: Buffer;
  expiresAt: number;
  upstream: string;
  latencyMs: Milliseconds;
}

export interface SecurityEvent {
  id: string;
  domain: DomainName;
  action: LookupAction;
  zone: SecurityZone;
  timestamp: number;
  latencyMs: Milliseconds;
  metadata?: string;
}

export interface SystemHealthMetrics {
  running: boolean;
  uptimeSeconds: number;
  memoryUsageMb: number;
  cacheHitRatio: number;
  totalQueries: number;
  blockedQueries: number;
  forwardedQueries: number;
  cachedQueries: number;
  cnameUncloaked: number;
  shannonEntropyBits: number;
  entropyPercentage: number;
  activePersona: string;
  fastestUpstream: string;
  recentSecurityEvents: SecurityEvent[];
}
