import React, { useState, useEffect } from "react";
import { 
  Shield, Download, Radio, ArrowRight, Menu, X, 
  ExternalLink, Search, Bell, Activity, Lock, Smartphone,
  CheckCircle2, Cpu, Zap, Globe, Sparkles, Layers, Landmark,
  EyeOff, Unlink, Binary, Sliders, Mic, FileCode, Check, RefreshCw
} from 'lucide-react';
import { LiveThreatRadar } from './components/LiveThreatRadar';
import { LiveEntropyWaveform } from './components/LiveEntropyWaveform';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [mobileTab, setMobileTab] = useState<'ios' | 'android'>('ios');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const downloadIosProfile = () => {
    window.open('http://127.0.0.1:5354/api/mobile/profile.mobileconfig', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden font-sans">
      {/* Background Matrix & Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle dot matrix grid */}
        <div 
          className="absolute inset-0 opacity-[0.12]" 
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
            backgroundSize: `32px 32px`
          }} 
        />
        
        {/* Top ambient white cone */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-40"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.03) 50%, transparent 80%)`
          }}
        />
      </div>

      {/* Header Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-[#27272a]/80 shadow-2xl' : 'bg-transparent border-b border-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-[1px] shadow-sm">
                <div className="w-full h-full bg-[#0a0a0c] rounded-[7px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wide text-white">
                  GhostShield
                </span>
                <span className="text-[8px] uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  APEX v4.0
                </span>
              </div>
            </div>
            
            {/* Nav Links */}
            <div className="hidden lg:flex items-center justify-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a href="#vectors" className="text-xs text-[#888888] hover:text-white transition-colors tracking-wide">
                17-Vector Grid
              </a>
              <a href="#quantum" className="text-xs text-[#888888] hover:text-white transition-colors tracking-wide">
                Post-Quantum ML-KEM
              </a>
              <a href="#mobile" className="text-xs text-[#888888] hover:text-white transition-colors tracking-wide">
                Mobile Zero-Install
              </a>
              <a href="#banking" className="text-xs text-[#888888] hover:text-white transition-colors tracking-wide">
                Zone A Banking Safe
              </a>
            </div>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              <button 
                onClick={() => window.open('/dashboard.html', '_self')}
                className="px-3.5 py-1.5 rounded-lg text-xs text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-all cursor-pointer border border-transparent hover:border-[#27272a]"
              >
                Control Center
              </button>
              <button 
                onClick={() => window.open('/dist_installer/GhostShield Setup 1.0.0.exe', '_blank')}
                className="px-3.5 py-1.5 rounded-lg text-xs text-black bg-white hover:bg-neutral-100 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Download .EXE</span>
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              className="lg:hidden text-white cursor-pointer p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-2xl border-b border-[#27272a] px-6 py-5 space-y-3">
            <a href="#vectors" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-[#a1a1aa] hover:text-white py-1">17-Vector Grid</a>
            <a href="#quantum" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-[#a1a1aa] hover:text-white py-1">Post-Quantum Armor</a>
            <a href="#mobile" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-[#a1a1aa] hover:text-white py-1">Mobile Zero-Install</a>
            <a href="/dashboard.html" className="block text-xs text-amber-400 font-medium py-1">Live Control Center</a>
            <div className="pt-3 border-t border-[#27272a]">
              <button 
                onClick={() => window.open('/dist_installer/GhostShield Setup 1.0.0.exe', '_blank')}
                className="w-full py-2 bg-white text-black text-xs rounded-lg flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Download for Windows
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-36 md:pb-24 flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Top Release Pill Badge */}
        <aside className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-[#18181b]/80 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] text-amber-300 tracking-wide">
            NIST FIPS 203 ML-KEM-768 Lattice Armor Online
          </span>
          <a
            href="#vectors"
            className="flex items-center gap-1 text-[10px] text-[#a1a1aa] hover:text-white transition-colors active:scale-95 ml-1"
          >
            Explore Defenses
            <ArrowRight size={10} />
          </a>
        </aside>

        {/* Hero Headline (Half White, Half Red) */}
        <h1 
          className="hero-main-title font-bungee text-3xl sm:text-5xl md:text-6xl text-center max-w-4xl px-4 leading-[1.2] mb-4 tracking-wide"
          style={{
            fontFamily: "'Bungee', 'Bungee Tint', sans-serif",
          }}
        >
          <span className="text-white">SURVEILLANCE</span>{" "}
          <span className="text-[#ef4444] text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]">DEFENSE</span>
        </h1>

        {/* Hero Subtitle (Simple & Clean) */}
        <p className="text-xs sm:text-sm text-center max-w-xl px-6 mb-8 text-[#a1a1aa] leading-relaxed">
          Autonomous Post-Quantum Privacy & Anti-Tracking Shield.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 relative z-10 mb-16">
          <button
            onClick={() => window.open('/dashboard.html', '_self')}
            className="h-10 px-6 rounded-xl text-xs text-black cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(to bottom, #ffffff 0%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.7) 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.8) inset, 0 10px 30px -5px rgba(0,0,0,0.8)"
            }}
          >
            <Shield className="w-3.5 h-3.5 text-black" />
            <span>Launch Fortress Dashboard</span>
          </button>

          <button
            onClick={() => setShowMobileModal(true)}
            className="h-10 px-5 rounded-xl text-xs text-white bg-[#141417] hover:bg-[#1f1f23] border border-[#27272a] hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Mobile Zero-Install Setup</span>
          </button>
        </div>

        {/* Showcase Container with the Exact Radiant Orange Horizon Glow */}
        <div className="w-full max-w-5xl relative pb-16">
          {/* THE RADIANT ELEVATED ORANGE HORIZON GLOW (MOVED UP & INTENSIFIED) */}
          {/* Layer 1: Wide High-Altitude Atmospheric Solar Flare */}
          <div 
            className="absolute -top-72 left-1/2 -translate-x-1/2 w-[1150px] h-[520px] pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245, 158, 11, 0.85) 0%, rgba(234, 88, 12, 0.6) 35%, rgba(194, 65, 12, 0.25) 65%, transparent 100%)`,
              filter: `blur(60px)`
            }}
          />
          {/* Layer 2: Concentrated Radiant Sunburst Core */}
          <div 
            className="absolute -top-48 left-1/2 -translate-x-1/2 w-[850px] h-[320px] pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 50% 55%, rgba(255, 215, 64, 0.98) 0%, rgba(245, 158, 11, 0.9) 30%, rgba(217, 119, 6, 0.5) 65%, transparent 100%)`,
              filter: `blur(36px)`
            }}
          />
          {/* Layer 3: Vibrant Horizon Glow immediately above the console */}
          <div 
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[680px] h-[160px] pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 55% 50% at 50% 80%, rgba(255, 230, 100, 1) 0%, rgba(245, 158, 11, 0.95) 45%, transparent 100%)`,
              filter: `blur(20px)`
            }}
          />
          {/* Layer 4: Laser Edge Horizon Line Rim on top of console */}
          <div 
            className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-[720px] h-[2px] pointer-events-none z-20"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.5) 15%, rgba(255, 255, 255, 1) 50%, rgba(245, 158, 11, 0.5) 85%, transparent 100%)`,
              boxShadow: `0 -4px 30px 6px rgba(245, 158, 11, 0.95), 0 -8px 60px 14px rgba(234, 88, 12, 0.75)`
            }}
          />

          {/* Dashboard Window Shell */}
          <div className="relative z-10 rounded-2xl overflow-hidden border border-[#27272a] bg-[#0c0c0e] shadow-[0_25px_80px_rgba(0,0,0,0.9)]">
            {/* Top Bar matching screenshot */}
            <div className="px-5 py-3.5 bg-[#141416] border-b border-[#27272a] flex items-center justify-between">
              {/* Left Logo / Title */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="font-mono">GhostShield Telemetry HUD</span>
                </div>
                <div className="hidden sm:block h-4 w-[1px] bg-[#27272a]" />
                <div className="hidden sm:block">
                  <h3 className="text-xs font-semibold text-white tracking-tight">Master Defense Console</h3>
                  <p className="text-[10px] text-[#71717a]">Autonomous 17-Vector Interception Engine Active • 61/61 Rules Enforced</p>
                </div>
              </div>

              {/* Right Search & Live Status */}
              <div className="flex items-center gap-2.5">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  PORT 53 ACTIVE
                </span>
                <button
                  onClick={() => window.open('/dashboard.html', '_self')}
                  className="px-3 py-1 rounded-lg bg-[#1f1f23] hover:bg-[#27272a] text-xs font-medium text-white border border-[#3f3f46] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Open HUD</span>
                  <ExternalLink className="w-3 h-3 text-[#a1a1aa]" />
                </button>
              </div>
            </div>

            {/* Dashboard Internal Grid with Live Threat Radar & Shannon Waveform */}
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-b from-[#0e0e11] to-[#070708]">
              {/* Radar Widget */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-[#141417]/80 border border-[#27272a] flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-wider font-bold">THREAT RADAR</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    360° SWEEP
                  </span>
                </div>
                <div className="my-1 scale-90">
                  <LiveThreatRadar />
                </div>
                <p className="text-[11px] text-[#71717a] text-center font-mono mt-2">
                  61/61 Mathematical Proofs Armed
                </p>
              </div>

              {/* Shannon Entropy Graph */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#141417]/80 border border-[#27272a] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-wider font-bold">SHANNON ENTROPY</span>
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">7.96 / 8.00 BITS</span>
                </div>
                <div className="my-auto py-2">
                  <LiveEntropyWaveform />
                </div>
                <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-[11px] font-mono text-[#71717a]">
                  <span>ML-KEM-768 LATTICE</span>
                  <span className="text-white font-medium">NIST FIPS 203</span>
                </div>
              </div>

              {/* Metrics Column */}
              <div className="lg:col-span-3 flex flex-col justify-between gap-3">
                <div className="p-4 rounded-xl bg-[#141417]/80 border border-[#27272a] hover:border-orange-500/40 transition-all">
                  <div className="flex items-center justify-between text-xs font-mono text-[#71717a] mb-1">
                    <span>CAPI POISON</span>
                    <span className="text-orange-400 font-bold">ARMED</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Meta Honey Tokens</h4>
                  <p className="text-[11px] text-[#71717a] mt-0.5">Synthetic fbclid injected.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#141417]/80 border border-[#27272a] hover:border-sky-500/40 transition-all">
                  <div className="flex items-center justify-between text-xs font-mono text-[#71717a] mb-1">
                    <span>MOBILE DoT</span>
                    <span className="text-sky-400 font-bold">ACTIVE</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Private DNS</h4>
                  <p className="text-[11px] text-[#71717a] mt-0.5">Shields Flipkart, Meesho & APKs.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#141417]/80 border border-[#27272a] hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between text-xs font-mono text-[#71717a] mb-1">
                    <span>ZONE A</span>
                    <span className="text-emerald-400 font-bold">0ms DELAY</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Banking Safe-Pass</h4>
                  <p className="text-[11px] text-[#71717a] mt-0.5">SBI, HDFC, UIDAI zero-failure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 17-Vector Sovereign Defense Grid Section */}
      <section id="vectors" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-[#27272a]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            COMPREHENSIVE SURVEILLANCE SINKHOLE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4 font-display">
            The 17-Vector Sovereign Defense Grid
          </h2>
          <p className="text-sm sm:text-base text-[#a1a1aa] mt-3 leading-relaxed">
            Eliminates behavioral profiling across your network, OS hardware, and browser runtime with zero performance impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-2xl bg-[#0c0c0e] border border-[#27272a] hover:border-red-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4 border border-red-500/20 group-hover:scale-110 transition-transform">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">1. Shopping Ad Tracker Sinkhole</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              100% blocks and drops surveillance packets from Criteo, Taboola, Outbrain, and invasive retargeting ad networks.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-red-400 uppercase font-bold">100% SINKHOLED</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0c0e] border border-[#27272a] hover:border-orange-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 border border-orange-500/20 group-hover:scale-110 transition-transform">
              <Unlink className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">2. CNAME Cloak Unmasking</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Detects third-party trackers disguised as first-party subdomains (e.g. Adobe Omniture, Keywee) and sinks them at the DNS layer.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-orange-400 uppercase font-bold">UNCLOAKED IN RAM</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0c0e] border border-[#27272a] hover:border-purple-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Binary className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">3. URL Clickstream Stripper</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Purges tracking parameters (`fbclid`, `gclid`, `ttclid`, `utm_*`) while strictly preserving legitimate state tokens.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-purple-400 uppercase font-bold">STRIPPED ON THE FLY</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0c0e] border border-[#27272a] hover:border-amber-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">4. Encrypted Client Hello (ECH)</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Synthesizes RFC 9460 HTTPS Type 65 records, concealing outer SNI from ISP monitoring and local middleboxes.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-amber-400 uppercase font-bold">RFC 9460 CONCEALED</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0c0e] border border-[#27272a] hover:border-emerald-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">5. Canvas & WebGPU Farbling</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Injects imperceptible differential noise into 2D canvas `getImageData` and WebGPU shader render targets.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-emerald-400 uppercase font-bold">FUZZED PER ORIGIN</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0c0e] border border-[#27272a] hover:border-blue-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">6. AudioContext Scrambler</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Adds randomized micro-jitter to audio oscillator frequencies, breaking ultrasonic cross-device tracking beacons.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-blue-400 uppercase font-bold">DISPERSED JITTER</span>
          </div>

        </div>
      </section>

      {/* Post-Quantum & ZK Section */}
      <section id="quantum" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-[#27272a]">
        <div className="rounded-3xl p-8 sm:p-12 bg-[#0c0c0e] border border-[#27272a] shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              NIST FIPS 203 POST-QUANTUM ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4 font-display">
              ML-KEM-768 Lattice Cryptography & Zero-Knowledge Merkle Proofs
            </h2>
            <p className="text-sm sm:text-base text-[#a1a1aa] mt-3 leading-relaxed">
              Built to withstand future quantum supercomputers with Ring Learning-With-Errors (Ring-LWE) polynomial arithmetic, eliminating "Harvest Now, Decrypt Later" risks forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272a]">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white font-mono">768-Dim Polynomial Ring</h4>
              <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                Calculated over polynomial ring R_q = Z_q[X]/(X^256 + 1) with modulus q=3329. Standardized by NIST FIPS 203.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272a]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white font-mono">Zero-Knowledge State Proofs</h4>
              <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                Cryptographic Merkle tree state roots verify threat lists without exposing client state or browser telemetry.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272a]">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white font-mono">7.96 / 8.00 Bits Quantum Entropy</h4>
              <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                Multi-source hardware thermal jitter + CPU clock skew pooled through a SHA3-512 quantum mixer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Zero-Install Section */}
      <section id="mobile" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-[#27272a]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              ZERO-INSTALL MOBILE ARMOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Protect Mobile Phones Without Installing Any Heavy Apps
            </h2>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              Mobile users never need to download battery-draining background utility apps. GhostShield uses native OS-level encrypted DNS profiles built directly into Apple iOS and Android.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Apple iOS / iPadOS Native Profile</h4>
                  <p className="text-[11px] text-[#71717a] mt-0.5">Encrypted <code className="text-amber-400 font-mono">.mobileconfig</code> with 0% background battery drain.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Android Private DNS (DoT)</h4>
                  <p className="text-[11px] text-[#71717a] mt-0.5">Blocks in-app ads and trackers in Flipkart, Meesho, games, and Chrome.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMobileModal(true)}
              className="mt-4 px-6 py-3 rounded-xl font-bold text-xs text-black bg-white hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <Smartphone className="w-4 h-4" />
              <span>Configure Mobile Device Now</span>
            </button>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0c0c0e] border border-[#27272a] shadow-2xl">
            <h3 className="text-base font-bold text-white font-display mb-4">Live Android & iOS Configuration</h3>
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a]">
                <span className="text-[#71717a] block text-[10px] uppercase font-bold">Android Private DNS Hostname:</span>
                <span className="text-amber-400 font-bold text-sm select-all mt-1 block">dns.ghostshield.local</span>
              </div>
              <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a]">
                <span className="text-[#71717a] block text-[10px] uppercase font-bold">iOS Profile Payload:</span>
                <span className="text-emerald-400 font-bold text-sm block mt-1">com.apple.dnsSettings.managed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zone A Banking Section */}
      <section id="banking" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-[#27272a]">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#0c0c0e] via-[#101014] to-[#0c0c0e] border border-[#27272a] shadow-2xl">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              DUAL-ZONE COGNITIVE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4 font-display">
              Zone A Banking & Govt Safe-Pass: 0ms Delay, Zero False Positives
            </h2>
            <p className="text-sm sm:text-base text-[#a1a1aa] mt-3 leading-relaxed">
              Unlike aggressive adblockers that break banking authentication and OTPs, GhostShield automatically classifies trusted financial and essential institutions into <strong>Zone A</strong> for transparent pass-through.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] text-center">
              <Landmark className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white">SBI / HDFC / ICICI</span>
              <p className="text-[10px] text-[#71717a] mt-0.5">Instant OTP Delivery</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] text-center">
              <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white">UIDAI / DigiLocker</span>
              <p className="text-[10px] text-[#71717a] mt-0.5">Govt Services Verified</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] text-center">
              <Zap className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white">Razorpay / UPI</span>
              <p className="text-[10px] text-[#71717a] mt-0.5">0ms Payment Gateway</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] text-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white">Income Tax Portal</span>
              <p className="text-[10px] text-[#71717a] mt-0.5">Zero Captcha Breaking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Armor Zero-Install Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0c0c0e] border border-[#27272a] rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white relative">
            <button
              onClick={() => setShowMobileModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#18181b] text-[#71717a] hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-[#27272a]">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg">
                <Smartphone className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Mobile Armor (Zero-Install)</h3>
                <p className="text-xs text-[#71717a]">Protect iPhone & Android without downloading any heavy apps</p>
              </div>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex gap-2 mt-4 p-1 rounded-2xl bg-[#141417] border border-[#27272a]">
              <button
                onClick={() => setMobileTab('ios')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mobileTab === 'ios'
                    ? 'bg-white text-black shadow-md'
                    : 'text-[#71717a] hover:text-white'
                }`}
              >
                Apple iOS (iPhone / iPad)
              </button>
              <button
                onClick={() => setMobileTab('android')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mobileTab === 'android'
                    ? 'bg-white text-black shadow-md'
                    : 'text-[#71717a] hover:text-white'
                }`}
              >
                Android 9+ (Samsung, Pixel)
              </button>
            </div>

            {/* Tab Contents */}
            <div className="mt-4 p-4 rounded-2xl bg-[#141417] border border-[#27272a] text-xs space-y-3">
              {mobileTab === 'ios' ? (
                <>
                  <p className="text-[#a1a1aa] font-medium leading-relaxed">
                    Uses Apple's native <code className="bg-[#1f1f23] px-1 py-0.5 rounded font-mono text-amber-400">com.apple.dnsSettings.managed</code> encrypted profile. Zero background battery consumption.
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[#71717a]">
                    <li>Tap Download Profile button below in Safari.</li>
                    <li>Open <strong>Settings &gt; Profile Downloaded</strong>.</li>
                    <li>Tap <strong>Install</strong> and authenticate.</li>
                  </ol>
                  <button
                    onClick={downloadIosProfile}
                    className="w-full mt-2 py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    Download iOS .mobileconfig Profile
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[#a1a1aa] font-medium leading-relaxed">
                    Uses Android's native <strong>Private DNS (DoT)</strong> engine built into Android 9, 10, 11, 12, 13, 14, 15+.
                  </p>
                  <div className="space-y-1.5 text-[#71717a]">
                    <p>1. Open <strong>Settings &gt; Network &amp; Internet &gt; Private DNS</strong>.</p>
                    <p>2. Select <strong>Private DNS provider hostname</strong>.</p>
                    <div className="p-2.5 bg-[#09090b] rounded-xl border border-[#27272a] font-mono text-xs text-amber-300 font-bold select-all text-center">
                      dns.ghostshield.local
                    </div>
                    <p>3. Tap <strong>Save</strong>. All apps, Flipkart, and games are instantly shielded.</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowMobileModal(false)}
                className="px-6 py-2 rounded-xl bg-[#141417] hover:bg-[#1f1f23] text-xs font-semibold text-white border border-[#27272a] cursor-pointer transition-colors"
              >
                Close Armor Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-[#27272a] text-center text-xs font-mono text-[#71717a] flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10">
        <span>GhostShield Apex v4.0 Institutional Matrix • 100% Free & Open-Source</span>
        <div className="flex items-center gap-6">
          <a href="/dashboard.html" className="hover:text-white transition-colors">Control Center</a>
          <a href="/dist_installer/GhostShield Setup 1.0.0.exe" className="hover:text-white transition-colors">Windows App</a>
          <a href="#vectors" className="hover:text-white transition-colors">17 Vectors</a>
        </div>
      </footer>
    </div>
  );
}
