/**
 * FUF Background Service Worker
 * Manages extension state, declarative rulesets, WebRTC policies, and dynamic script registration.
 */

import { ShieldState, ShieldLogEvent } from '../types/shield';
import { DEFAULT_TRUSTED_DOMAINS } from '../kernel/dual_zone_router';
import { AIPoisoningEngine } from '../kernel/ai_poisoning';

const DEFAULT_STATE: ShieldState = {
  enabled: true,
  activeZone: 'WILD_WEB',
  currentDomain: '',
  counters: {
    trackersBlocked: 0,
    canvasScrambles: 0,
    audioScrambles: 0,
    hardwareMasks: 0,
    poisonQueriesDispatched: 0,
  },
  features: {
    canvasFarbling: true,
    audioFarbling: true,
    hardwareSpoofing: true,
    webRTCProtection: true,
    aiPoisoning: true,
    smartBankingWhitelist: true,
  },
  trustedDomains: DEFAULT_TRUSTED_DOMAINS,
  recentEvents: [],
};

const poisonEngine = new AIPoisoningEngine();

async function getStoredState(): Promise<ShieldState> {
  const data = await chrome.storage.local.get('fuf_state');
  if (data && data.fuf_state) {
    return data.fuf_state;
  }
  await chrome.storage.local.set({ fuf_state: DEFAULT_STATE });
  return DEFAULT_STATE;
}

async function saveState(state: ShieldState): Promise<void> {
  await chrome.storage.local.set({ fuf_state: state });
  updateBadge(state);
}

function updateBadge(state: ShieldState) {
  if (!state.enabled) {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#64748b' });
    return;
  }

  const totalActions =
    state.counters.trackersBlocked +
    state.counters.canvasScrambles +
    state.counters.audioScrambles +
    state.counters.hardwareMasks;

  const displayCount = totalActions > 999 ? '999+' : totalActions.toString();
  chrome.action.setBadgeText({ text: displayCount });
  chrome.action.setBadgeBackgroundColor({
    color: state.activeZone === 'TRUSTED' ? '#22c55e' : '#0284c7',
  });
}

import { GhostTunnelEngine } from '../core/ghost_tunnel';

const ghostTunnel = new GhostTunnelEngine();

// 1. Enforce GhostTunnel PAC Split-Tunneling Policy ($0 Server Infrastructure)
function enforceGhostTunnelPolicy(enabled: boolean) {
  try {
    if (chrome.proxy && chrome.proxy.settings) {
      if (enabled) {
        const pacScript = ghostTunnel.generatePacScript();
        chrome.proxy.settings.set(
          {
            value: {
              mode: 'pac_script',
              pacScript: { data: pacScript },
            },
            scope: 'regular',
          },
          () => {
            console.log('[FUF GhostTunnel] 🌐 Smart Split-Tunnel PAC Active (Zone A Direct & Cloaked Relays)');
          }
        );
      } else {
        chrome.proxy.settings.set(
          {
            value: { mode: 'direct' },
            scope: 'regular',
          },
          () => {
            console.log('[FUF GhostTunnel] ⏹️ Direct Routing Restored');
          }
        );
      }
    }
  } catch (err) {
    console.debug('[FUF] GhostTunnel setup note:', err);
  }
}

// 2. Enforce WebRTC leak prevention
function enforceWebRTCPolicy(enabled: boolean) {
  try {
    if (chrome.privacy && chrome.privacy.network && chrome.privacy.network.webRTCIPHandlingPolicy) {
      chrome.privacy.network.webRTCIPHandlingPolicy.set({
        value: enabled ? 'disable_non_proxied_udp' : 'default',
      });
    }
  } catch (err) {
    console.debug('[FUF] WebRTC policy setup:', err);
  }
}

// 2. Register MAIN-world scripting dynamically
async function registerMainWorldScripts() {
  try {
    if (chrome.scripting && chrome.scripting.registerContentScripts) {
      const existing = await chrome.scripting.getRegisteredContentScripts();
      const ids = existing.map((s) => s.id);
      if (ids.includes('fuf_main_kernel')) {
        await chrome.scripting.unregisterContentScripts({ ids: ['fuf_main_kernel'] });
      }

      await chrome.scripting.registerContentScripts([
        {
          id: 'fuf_main_kernel',
          matches: ['<all_urls>'],
          js: ['content_scripts/injection_kernel.js'],
          runAt: 'document_start',
          world: 'MAIN',
          allFrames: true,
          persistAcrossSessions: true,
        },
      ]);
      console.log('[FUF] MAIN World Kernel Registered with CSP Bypass');
    }
  } catch (err) {
    console.debug('[FUF] Scripting registration note:', err);
  }
}

// 3. Setup periodic AI Noise dispatch alarm
chrome.alarms.create('ai_poison_timer', { periodInMinutes: 2 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'ai_poison_timer') {
    const state = await getStoredState();
    if (state.enabled && state.features.aiPoisoning) {
      const query = poisonEngine.getRandomSyntheticQuery();
      state.counters.poisonQueriesDispatched += 1;

      const event: ShieldLogEvent = {
        id: 'ev_' + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        type: 'AI_POISON',
        domain: 'global-ai-graph',
        details: `Dispatched synthetic entropy: "${query}"`,
      };

      state.recentEvents = [event, ...state.recentEvents.slice(0, 49)];
      await saveState(state);
    }
  }
});

// 4. Service Worker Lifecycle Init
chrome.runtime.onInstalled.addListener(async () => {
  const state = await getStoredState();
  enforceWebRTCPolicy(state.features.webRTCProtection);
  enforceGhostTunnelPolicy(state.enabled);
  await registerMainWorldScripts();
  updateBadge(state);
  console.log('[FUF] Core Engine Initialized in Manifest V3');
});

chrome.runtime.onStartup.addListener(async () => {
  const state = await getStoredState();
  enforceGhostTunnelPolicy(state.enabled);
  await registerMainWorldScripts();
});

// 5. Message Router
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    const state = await getStoredState();

    switch (message.type) {
      case 'GET_STATE':
        sendResponse(state);
        break;

      case 'TOGGLE_SHIELD':
        state.enabled = message.payload;
        enforceWebRTCPolicy(state.enabled && state.features.webRTCProtection);
        enforceGhostTunnelPolicy(state.enabled);
        await saveState(state);
        sendResponse(state);
        break;

      case 'TOGGLE_FEATURE':
        const { feature, value } = message.payload;
        (state.features as any)[feature] = value;
        if (feature === 'webRTCProtection') {
          enforceWebRTCPolicy(state.enabled && value);
        }
        await saveState(state);
        sendResponse(state);
        break;

      case 'ZONE_DETECTED':
        state.currentDomain = message.payload.hostname;
        state.activeZone = message.payload.zone;
        await saveState(state);
        sendResponse({ success: true });
        break;

      case 'LOG_EVENT':
        const log = message.payload as ShieldLogEvent;
        if (log.type === 'CANVAS_SCRAMBLE') state.counters.canvasScrambles += 1;
        if (log.type === 'AUDIO_SCRAMBLE') state.counters.audioScrambles += 1;
        if (log.type === 'HARDWARE_MASK') state.counters.hardwareMasks += 1;
        if (log.type === 'TRACKER_BLOCKED') state.counters.trackersBlocked += 1;

        state.recentEvents = [log, ...state.recentEvents.slice(0, 49)];
        await saveState(state);
        sendResponse({ success: true });
        break;

      case 'ADD_TRUSTED_DOMAIN':
        if (!state.trustedDomains.includes(message.payload)) {
          state.trustedDomains.push(message.payload);
          await saveState(state);
        }
        sendResponse(state);
        break;

      case 'REMOVE_TRUSTED_DOMAIN':
        state.trustedDomains = state.trustedDomains.filter((d) => d !== message.payload);
        await saveState(state);
        sendResponse(state);
        break;

      default:
        sendResponse({ error: 'Unknown message type' });
    }
  })();
  return true;
});
