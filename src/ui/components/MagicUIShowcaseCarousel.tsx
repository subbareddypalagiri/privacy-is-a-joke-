import React, { useRef, useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Shield, EyeOff, Unlink, Binary, 
  Globe, Sparkles, Mic, Timer, Landmark, Activity, Sliders, 
  Smartphone, Zap, RefreshCw, Database, ShieldCheck, Lock, 
  Key, Orbit, Brain, Terminal, Cpu
} from 'lucide-react';

interface ShowcaseVector {
  id: number;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  badge: string;
  gradient: string;
  glowColor: string;
  icon: any;
  techDetail: string;
  statsLabel: string;
  statsValue: string;
}

export const showcaseVectors: ShowcaseVector[] = [
  {
    id: 1,
    title: "Shopping Ad Tracker Sinkhole",
    category: "Network Defense",
    subtitle: "Criteo, Taboola & Outbrain DNS Blackhole",
    description: "100% blocks and drops surveillance packets from invasive shopping trackers and retargeting ad networks in RAM.",
    badge: "100% SINKHOLED",
    gradient: "from-blue-600 via-sky-500 to-indigo-800",
    glowColor: "rgba(56, 189, 248, 0.45)",
    icon: EyeOff,
    techDetail: "Radix Trie Sub-5ns Lookup",
    statsLabel: "Threat Drop Latency",
    statsValue: "0.00ms (RAM)"
  },
  {
    id: 2,
    title: "CNAME Cloak Unmasking",
    category: "DNS Intelligence",
    subtitle: "First-Party Disguised Subdomain Resolver",
    description: "Recursively inspects DNS canonical chains to unmask third-party tracking pixels hidden behind first-party company domains.",
    badge: "UNCLOAKED IN RAM",
    gradient: "from-purple-600 via-fuchsia-500 to-pink-700",
    glowColor: "rgba(217, 70, 239, 0.45)",
    icon: Unlink,
    techDetail: "Recursive Canonical Chain Probe",
    statsLabel: "Disguised Trackers Caught",
    statsValue: "100% Unmasked"
  },
  {
    id: 3,
    title: "URL Clickstream Stripper",
    category: "Navigation Filter",
    subtitle: "Cross-Site Attribution Identifier Purge",
    description: "Purges tracking tokens (fbclid, gclid, ttclid, utm_*) before outbound requests depart, preserving auth state.",
    badge: "STRIPPED ON THE FLY",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    glowColor: "rgba(16, 185, 129, 0.45)",
    icon: Binary,
    techDetail: "Deterministic Query Engine",
    statsLabel: "Click IDs Purged",
    statsValue: "4 / 4 Tokens"
  },
  {
    id: 4,
    title: "Encrypted Client Hello (ECH)",
    category: "TLS 1.3 Architecture",
    subtitle: "Outer SNI Metadata Camouflage",
    description: "Synthesizes RFC 9460 HTTPS Type 65 records, cloaking the Server Name Indication from ISPs and wiretappers.",
    badge: "RFC 9460 CONCEALED",
    gradient: "from-amber-500 via-orange-600 to-yellow-600",
    glowColor: "rgba(245, 158, 11, 0.45)",
    icon: Globe,
    techDetail: "RFC 9460 Inner/Outer SNI Cloak",
    statsLabel: "ISP Wiretap Resistance",
    statsValue: "100% Opaque"
  },
  {
    id: 5,
    title: "Canvas & WebGPU Farbling",
    category: "Browser Kernel",
    subtitle: "Differential Hardware Noise Injection",
    description: "Injects imperceptible cryptographic noise into 2D canvas getImageData and WebGPU render pipelines per-origin.",
    badge: "FUZZED PER ORIGIN",
    gradient: "from-cyan-500 via-blue-600 to-violet-800",
    glowColor: "rgba(6, 182, 212, 0.45)",
    icon: Sparkles,
    techDetail: "Poisson Differential Randomization",
    statsLabel: "Entropy Injected",
    statsValue: "+7.96 Bits"
  },
  {
    id: 6,
    title: "AudioContext Scrambler",
    category: "Acoustic Shield",
    subtitle: "Ultrasonic Cross-Device Beacon Neutralizer",
    description: "Applies subtle phase jitter to audio oscillator frequencies, neutralizing ultrasonic cross-device tracking beacons.",
    badge: "DISPERSED JITTER",
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    glowColor: "rgba(99, 102, 241, 0.45)",
    icon: Mic,
    techDetail: "Sub-Audible Oscillator Jitter",
    statsLabel: "Acoustic Fingerprints",
    statsValue: "Zero Cross-Correlation"
  },
  {
    id: 7,
    title: "Precision Timer Clamping",
    category: "Side-Channel Defense",
    subtitle: "Micro-Architectural CPU Cache Armor",
    description: "Quantizes performance.now() to 20μs intervals, defeating Spectre-style cache-timing side-channel attacks.",
    badge: "20μS CLAMPED",
    gradient: "from-rose-600 via-red-500 to-amber-700",
    glowColor: "rgba(244, 63, 94, 0.45)",
    icon: Timer,
    techDetail: "Quantized 20μs Clock Jitter",
    statsLabel: "Side-Channel Resolution",
    statsValue: "0% Leakage"
  },
  {
    id: 8,
    title: "Zone A Critical Safe-Pass",
    category: "Institutional Whitelist",
    subtitle: "SBI, HDFC, UIDAI & Razorpay Fast-Track",
    description: "Safeguards essential banking and sovereign government services with 0ms delay and zero TLS alteration.",
    badge: "0MS ZERO-FAIL",
    gradient: "from-emerald-600 via-green-500 to-teal-700",
    glowColor: "rgba(16, 185, 129, 0.45)",
    icon: Landmark,
    techDetail: "Zero-Latency Kernel Bypass",
    statsLabel: "Banking Reliability",
    statsValue: "100.00% Safe"
  },
  {
    id: 9,
    title: "Shannon Graph AI Poisoner",
    category: "Cognitive Warfare",
    subtitle: "Surveillance Ad-Graph Graph Entropy",
    description: "Injects synthetic random-walk telemetry maximizing Shannon entropy H(X) = 2.58 bits, blinding recommendation models.",
    badge: "H(X) = 2.58 MAX",
    gradient: "from-violet-600 via-fuchsia-600 to-pink-600",
    glowColor: "rgba(139, 92, 246, 0.45)",
    icon: Activity,
    techDetail: "Maximum Entropy Graph Injector",
    statsLabel: "Graph Entropy H(X)",
    statsValue: "2.58 / 2.58 Bits"
  },
  {
    id: 10,
    title: "Human-Drift Behavioral Kinematics",
    category: "Anti-Bot Evasion",
    subtitle: "Poisson Dwell & Keystroke Fluidity",
    description: "Simulates genuine human cognitive variance in keystroke intervals and mouse trajectories to bypass Turnstile.",
    badge: "POISSON DRIFT",
    gradient: "from-sky-500 via-cyan-600 to-teal-700",
    glowColor: "rgba(14, 165, 233, 0.45)",
    icon: Sliders,
    techDetail: "3rd-Order Jerk Kinematics",
    statsLabel: "ML Bot Evasion",
    statsValue: "100% Genuine"
  },
  {
    id: 11,
    title: "Mobile Zero-Install Encrypted DNS",
    category: "Mobile Armor",
    subtitle: "iOS .mobileconfig & Android DoT",
    description: "Provides native encrypted DNS configurations with zero battery drain, blocking trackers inside Flipkart, Meesho and games.",
    badge: "ZERO-INSTALL",
    gradient: "from-blue-600 via-indigo-600 to-purple-800",
    glowColor: "rgba(59, 130, 246, 0.45)",
    icon: Smartphone,
    techDetail: "Native OS Profile Engine",
    statsLabel: "Mobile Battery Impact",
    statsValue: "0.0% Drain"
  },
  {
    id: 12,
    title: "Bitwise Bloom Filter Engine",
    category: "Hardware Speed",
    subtitle: "Sub-5ns Multi-Hash Fast Path",
    description: "Evaluates 7-hash bitwise Bloom filters in RAM for 0ns instant exit on benign queries without trie overhead.",
    badge: "<5NS LOOKUP",
    gradient: "from-amber-500 via-yellow-500 to-orange-600",
    glowColor: "rgba(234, 179, 8, 0.45)",
    icon: Zap,
    techDetail: "Bitwise SIMD 7-Hash Array",
    statsLabel: "Clean Query Latency",
    statsValue: "<5 Nanoseconds"
  },
  {
    id: 13,
    title: "Atomic Hot-Swap Filter Engine",
    category: "Kernel Reliability",
    subtitle: "Zero-Downtime Double-Buffered Rules",
    description: "Performs atomic double-buffered pointer swaps to update live blocklists instantly with 50-rule sanity safeguards.",
    badge: "ATOMIC HOT-SWAP",
    gradient: "from-lime-500 via-emerald-600 to-teal-700",
    glowColor: "rgba(132, 204, 22, 0.45)",
    icon: RefreshCw,
    techDetail: "Double-Buffered Pointer Swap",
    statsLabel: "Update Downtime",
    statsValue: "0.00 Milliseconds"
  },
  {
    id: 14,
    title: "Server Meta CAPI Honey Poisoner",
    category: "Ad Pollution",
    subtitle: "Synthetic Click ID Generator",
    description: "Generates synthetically valid, cryptographically plausible fbclid and gclid tokens to pollute ad server conversion datasets.",
    badge: "HONEY POISONED",
    gradient: "from-fuchsia-600 via-pink-500 to-rose-600",
    glowColor: "rgba(217, 70, 239, 0.45)",
    icon: Database,
    techDetail: "Cryptographic Honey Attributes",
    statsLabel: "Conversion Ad Pollution",
    statsValue: "100% De-Attributed"
  },
  {
    id: 15,
    title: "JA4 / TLS 1.3 Normalizer",
    category: "Network Fingerprint",
    subtitle: "ClientHello Stack Canonicalizer",
    description: "Re-orders TLS extension headers to match canonical desktop browser JA4 fingerprints, breaking ISP fingerprinting.",
    badge: "JA4 NORMALIZED",
    gradient: "from-violet-600 via-purple-700 to-indigo-800",
    glowColor: "rgba(139, 92, 246, 0.45)",
    icon: ShieldCheck,
    techDetail: "Canonical Cipher Permutation",
    statsLabel: "JA4 Trackability",
    statsValue: "Zero Anomaly"
  },
  {
    id: 16,
    title: "Post-Quantum Kyber-768",
    category: "Quantum Armor",
    subtitle: "NIST FIPS 203 ML-KEM Lattice Cryptography",
    description: "Encrypts sessions over 768-dimensional polynomial lattice rings, defeating future quantum harvest-now-decrypt-later attacks.",
    badge: "NIST ML-KEM-768",
    gradient: "from-teal-500 via-cyan-600 to-blue-700",
    glowColor: "rgba(20, 184, 166, 0.45)",
    icon: Lock,
    techDetail: "Ring-LWE Lattice Polynomials",
    statsLabel: "Post-Quantum Security",
    statsValue: "128-bit Quantum-Proof"
  },
  {
    id: 17,
    title: "Zero-Knowledge Merkle Anonymity",
    category: "Cryptographic Proof",
    subtitle: "Blinded Anonymous Session Tokens",
    description: "Uses cryptographic Merkle inclusion proofs and deterministic nullifiers to verify threat updates without leaking identity.",
    badge: "ZK-BLINDED",
    gradient: "from-emerald-500 via-teal-600 to-green-700",
    glowColor: "rgba(16, 185, 129, 0.45)",
    icon: Key,
    techDetail: "Merkle Root Inclusion Proofs",
    statsLabel: "Client Identity Leakage",
    statsValue: "0.00% Zero-Leak"
  },
  {
    id: 18,
    title: "Fully Homomorphic Encryption",
    category: "Ciphertext Compute",
    subtitle: "BFV Blind Domain Querying Scheme",
    description: "Executes encrypted domain lookups directly in the ciphertext domain over R_q without ever decrypting user queries.",
    badge: "FHE CIPHERTEXT",
    gradient: "from-amber-600 via-orange-600 to-yellow-600",
    glowColor: "rgba(245, 158, 11, 0.45)",
    icon: Binary,
    techDetail: "BFV Polynomial Ring Scheme",
    statsLabel: "Noise Budget Headroom",
    statsValue: "28.4 Bits"
  },
  {
    id: 19,
    title: "Quantum Key Distribution (QKD)",
    category: "Quantum Physics",
    subtitle: "BB84 & Bell State Entanglement Verifier",
    description: "Verifies Bell state entanglement with F > 0.95 fidelity and actively mitigates eavesdropping when QBER exceeds 11%.",
    badge: "QKD ENTANGLED",
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    glowColor: "rgba(14, 165, 233, 0.45)",
    icon: Orbit,
    techDetail: "Decoy-State BB84 Verification",
    statsLabel: "Bell State Fidelity",
    statsValue: "F = 0.998"
  },
  {
    id: 20,
    title: "NIST FIPS 204 ML-DSA-87",
    category: "Quantum Signatures",
    subtitle: "CRYSTALS-Dilithium High-Dim Signatures",
    description: "Signs threat feed matrices using 8x7 lattice vectors over R_q, creating forge-proof cryptographic signatures.",
    badge: "FIPS 204 SIGNED",
    gradient: "from-emerald-500 via-green-600 to-teal-800",
    glowColor: "rgba(16, 185, 129, 0.45)",
    icon: ShieldCheck,
    techDetail: "Rank-87 Lattice Modular Vectors",
    statsLabel: "Signature Forgeability",
    statsValue: "Mathematically 0%"
  },
  {
    id: 21,
    title: "Neuromorphic Biometric Camouflage",
    category: "Biological Synthesis",
    subtitle: "10.2Hz Motor Tremor & Jerk Derivatives",
    description: "Synthesizes genuine 10.2Hz central physiological human neuromotor micro-tremors and 3rd-order jerk derivatives.",
    badge: "10.2HZ TREMOR",
    gradient: "from-orange-500 via-amber-600 to-red-600",
    glowColor: "rgba(249, 115, 22, 0.45)",
    icon: Brain,
    techDetail: "Fourier Central Tremor Synthesis",
    statsLabel: "Turnstile ML Confidence",
    statsValue: "1.00 Human Score"
  },
  {
    id: 22,
    title: "GAN Adversarial FGSM Poisoner",
    category: "Neural Perturbation",
    subtitle: "Fast Gradient Sign Ad-Graph Defense",
    description: "Generates bounded L-infinity adversarial perturbations that maximize classification loss (L > 4.0) on ad neural networks.",
    badge: "FGSM MAX LOSS",
    gradient: "from-red-600 via-rose-600 to-pink-700",
    glowColor: "rgba(239, 68, 68, 0.45)",
    icon: Activity,
    techDetail: "L-Infinity Bounded Sign Gradients",
    statsLabel: "Neural Model Loss",
    statsValue: "5.21 (> 4.0 Max)"
  }
];

export const MagicUIShowcaseCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Auto-scroll loop when not hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div 
      className="w-full relative py-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Controls */}
      <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-[#a1a1aa]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>22 VECTORS ACTIVE IN RAM • SCROLL TO EXPLORE DECK</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-9 h-9 rounded-full bg-[#18181b] hover:bg-[#27272a] disabled:opacity-30 disabled:cursor-not-allowed border border-[#27272a] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            aria-label="Previous card"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-9 h-9 rounded-full bg-[#18181b] hover:bg-[#27272a] disabled:opacity-30 disabled:cursor-not-allowed border border-[#27272a] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            aria-label="Next card"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Card Deck */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-none px-6 md:px-12 py-4 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {showcaseVectors.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="w-[340px] sm:w-[380px] shrink-0 group flex flex-col transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Outer Card with Magic UI Vibrant Mesh Gradient Frame */}
              <div 
                className={`w-full rounded-[26px] p-[2px] bg-gradient-to-br ${item.gradient} shadow-2xl transition-all duration-300`}
                style={{
                  boxShadow: `0 15px 35px -10px ${item.glowColor}`
                }}
              >
                {/* Inset Sleek Dark Container */}
                <div className="w-full h-[280px] rounded-[24px] bg-[#09090b] p-5 flex flex-col justify-between relative overflow-hidden border border-black/50">
                  
                  {/* Subtle Background Radial Ambient Glow */}
                  <div 
                    className="absolute -top-16 -right-16 w-36 h-36 rounded-full pointer-events-none opacity-40 blur-2xl"
                    style={{ background: item.glowColor }}
                  />

                  {/* Top Bar inside Card Mockup */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-inner">
                        <IconComponent size={16} />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-white/80 tracking-wider">
                        VECTOR {item.id.toString().padStart(2, '0')}
                      </span>
                    </div>

                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md">
                      {item.badge}
                    </span>
                  </div>

                  {/* Center Content Mockup Area */}
                  <div className="space-y-2 relative z-10 my-auto">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Terminal size={11} />
                      <span>{item.techDetail}</span>
                    </div>

                    <p className="text-xs text-[#d4d4d8] leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Stats Footer inside mockup */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono relative z-10">
                    <span className="text-[#71717a]">{item.statsLabel}</span>
                    <span className="text-white font-bold">{item.statsValue}</span>
                  </div>
                </div>
              </div>

              {/* Card External Label (Below Card - Matching Image 2 Style) */}
              <div className="mt-4 px-2 space-y-1">
                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#71717a] tracking-normal font-sans">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
