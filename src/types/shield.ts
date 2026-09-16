export interface ShieldState {
  enabled: boolean;
  activeZone: 'TRUSTED' | 'WILD_WEB';
  currentDomain: string;
  counters: {
    trackersBlocked: number;
    canvasScrambles: number;
    audioScrambles: number;
    hardwareMasks: number;
    poisonQueriesDispatched: number;
  };
  features: {
    canvasFarbling: boolean;
    audioFarbling: boolean;
    hardwareSpoofing: boolean;
    webRTCProtection: boolean;
    aiPoisoning: boolean;
    smartBankingWhitelist: boolean;
  };
  trustedDomains: string[];
  recentEvents: ShieldLogEvent[];
}

export interface ShieldLogEvent {
  id: string;
  timestamp: number;
  type: 'CANVAS_SCRAMBLE' | 'AUDIO_SCRAMBLE' | 'TRACKER_BLOCKED' | 'HARDWARE_MASK' | 'AI_POISON';
  domain: string;
  details: string;
}

export type ShieldMessage =
  | { type: 'GET_STATE' }
  | { type: 'STATE_UPDATE'; payload: ShieldState }
  | { type: 'TOGGLE_SHIELD'; payload: boolean }
  | { type: 'TOGGLE_FEATURE'; payload: { feature: keyof ShieldState['features']; value: boolean } }
  | { type: 'LOG_EVENT'; payload: ShieldLogEvent }
  | { type: 'ADD_TRUSTED_DOMAIN'; payload: string }
  | { type: 'REMOVE_TRUSTED_DOMAIN'; payload: string }
  | { type: 'DISPATCH_POISON_QUERY'; payload: { query: string } };
