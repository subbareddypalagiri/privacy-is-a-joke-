import React, { useState, useEffect } from "react";
import { 
  Shield, Download, Radio, ArrowRight, Menu, X, 
  ExternalLink, Search, Bell, Activity, Lock, Smartphone,
  CheckCircle2, Cpu, Zap, Globe, Sparkles, Layers, Landmark,
  EyeOff, Unlink, Binary, Sliders, Mic, FileCode, Check, RefreshCw,
  Timer, Database, ShieldCheck, Key, Orbit, Brain
} from 'lucide-react';
import { LiveThreatRadar } from './components/LiveThreatRadar';
import { LiveEntropyWaveform } from './components/LiveEntropyWaveform';
import { KineticMeshGrid } from './components/KineticMeshGrid';

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
      {/* FULL-PAGE INTERACTIVE KINETIC MESH BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <KineticMeshGrid 
          theme="cyan" 
          interactive={true} 
          className="w-full h-full opacity-65"
        />
        {/* Ambient Top Light Beam */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[480px] pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.25), rgba(245, 158, 11, 0.08) 50%, transparent 80%)`
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
                  FUF
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
                onClick={() => window.open('/dist_installer/FUF Setup 1.0.0.exe', '_blank')}
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
                onClick={() => window.open('/dist_installer/FUF Setup 1.0.0.exe', '_blank')}
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

        {/* Showcase Container with Aceternity Curved Glowing Orange Planet Horizon Arc */}
        <div className="w-full max-w-5xl relative pb-16 mt-2">
          {/* 1. Volumetric Atmospheric Solar Flare along the curve */}
          <div 
            className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1050px] h-[240px] pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 70% 55% at 50% 85%, rgba(245, 158, 11, 0.7) 0%, rgba(234, 88, 12, 0.35) 40%, rgba(180, 83, 9, 0.1) 70%, transparent 100%)`,
              filter: `blur(45px)`
            }}
          />

          {/* 2. Precision Curved Glowing SVG Planet Arc */}
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[1100px] h-[170px] pointer-events-none z-10 overflow-visible">
            <svg 
              viewBox="0 0 1100 170" 
              className="w-full h-full"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="aceternityArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                  <stop offset="20%" stopColor="#f59e0b" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
                  <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
                <filter id="arcLaserGlow" x="-20%" y="-40%" width="140%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faint Outer Corona Arc */}
              <path 
                d="M 20 160 Q 550 15 1080 160" 
                stroke="#f59e0b" 
                strokeWidth="6" 
                strokeOpacity="0.35"
                filter="blur(8px)"
              />

              {/* Intense Sharp Glowing Horizon Arc Line */}
              <path 
                d="M 20 160 Q 550 15 1080 160" 
                stroke="url(#aceternityArcGradient)" 
                strokeWidth="2.5" 
                filter="url(#arcLaserGlow)"
                style={{
                  filter: "drop-shadow(0 0 14px rgba(245, 158, 11, 0.95)) drop-shadow(0 0 32px rgba(234, 88, 12, 0.65))"
                }}
              />
            </svg>
          </div>

          {/* Dashboard Window Shell */}
          <div className="relative z-10 rounded-2xl overflow-hidden border border-[#27272a] bg-[#0c0c0e] shadow-[0_25px_80px_rgba(0,0,0,0.9)]">
            {/* Top Bar matching screenshot */}
            <div className="px-5 py-3.5 bg-[#141416] border-b border-[#27272a] flex items-center justify-between">
              {/* Left Logo / Title */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="font-mono">FUF Telemetry HUD</span>
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

      {/* 22-Vector Sovereign Defense Grid Section */}
      <section id="vectors" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-[#27272a]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            COMPREHENSIVE SURVEILLANCE SINKHOLE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4 font-display">
            The 22-Vector Sovereign Defense Grid
          </h2>
          <p className="text-sm sm:text-base text-[#a1a1aa] mt-3 leading-relaxed">
            Eliminates behavioral profiling across your network, OS hardware, and browser runtime with zero performance impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Vector 1 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4 border border-red-500/20 group-hover:scale-110 transition-transform">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">1. Shopping Ad Tracker Sinkhole</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              100% blocks and drops surveillance packets from Criteo, Taboola, Outbrain, and invasive retargeting ad networks.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-red-400 uppercase font-semibold px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">100% SINKHOLED</span>
          </div>

          {/* Vector 2 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 border border-orange-500/20 group-hover:scale-110 transition-transform">
              <Unlink className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">2. CNAME Cloak Unmasking</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Detects third-party trackers disguised as first-party subdomains (e.g. Adobe Omniture, Keywee) and sinks them at the DNS layer.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-orange-400 uppercase font-semibold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">UNCLOAKED IN RAM</span>
          </div>

          {/* Vector 3 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Binary className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">3. URL Clickstream Stripper</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Purges tracking parameters (`fbclid`, `gclid`, `ttclid`, `utm_*`) while strictly preserving legitimate state tokens.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-purple-400 uppercase font-semibold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">STRIPPED ON THE FLY</span>
          </div>

          {/* Vector 4 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">4. Encrypted Client Hello (ECH)</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Synthesizes RFC 9460 HTTPS Type 65 records, concealing outer SNI from ISP monitoring and local middleboxes.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-amber-400 uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">RFC 9460 CONCEALED</span>
          </div>

          {/* Vector 5 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">5. Canvas & WebGPU Farbling</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Injects imperceptible differential noise into 2D canvas `getImageData` and WebGPU shader render targets.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-emerald-400 uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">FUZZED PER ORIGIN</span>
          </div>

          {/* Vector 6 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-sky-500/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/20 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">6. AudioContext Scrambler</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Adds randomized micro-jitter to audio oscillator frequencies, breaking ultrasonic cross-device tracking beacons.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-sky-400 uppercase font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">DISPERSED JITTER</span>
          </div>

          {/* Vector 7 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">7. Precision Timer Jitter Clamping</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Clamps `performance.now()` to 20μs intervals, defeating micro-architectural CPU cache side-channel attacks.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-indigo-400 uppercase font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">20μS CLAMPED</span>
          </div>

          {/* Vector 8 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">8. Zone A Critical Infrastructure Safe-Pass</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Whitelists SBI, HDFC, UIDAI Gov, and Razorpay payment gateways with 0ms latency and zero TLS interference.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-emerald-400 uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">0MS ZERO-FAIL</span>
          </div>

          {/* Vector 9 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">9. Shannon Graph Entropy Poisoning</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Injects synthetic random-walk telemetry queries maximizing Shannon entropy $H(X) = 2.58$ bits, blinding Big Tech AI graphs.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-rose-400 uppercase font-semibold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">H(X) = 2.58 MAX</span>
          </div>

          {/* Vector 10 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">10. Human-Drift Poisson Kinematics</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Generates organic human-like dwell times and keystroke intervals with natural Poisson cognitive variance.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-cyan-400 uppercase font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">POISSON DRIFT</span>
          </div>

          {/* Vector 11 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">11. Mobile Zero-Install Encrypted DNS</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Generates native Apple iOS `.mobileconfig` and Android DoT private DNS with 0% battery impact and zero heavy apps.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-blue-400 uppercase font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">ZERO-INSTALL</span>
          </div>

          {/* Vector 12 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-4 border border-yellow-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">12. Bitwise Bloom Filter Sub-5ns Acceleration</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Evaluates 7-hash bitwise Bloom filter in $O(1)$ memory, guaranteeing immediate sub-5ns execution for benign queries.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-yellow-400 uppercase font-semibold px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">&lt;5NS LOOKUP</span>
          </div>

          {/* Vector 13 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-lime-500/50 hover:shadow-[0_0_30px_rgba(132,204,22,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center mb-4 border border-lime-500/20 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">13. Double-Buffered Atomic Hot-Swap Engine</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Updates threat blocklists in real time via pointer swaps with zero downtime, guarded by a 50-rule sanity threshold.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-lime-400 uppercase font-semibold px-2 py-0.5 rounded bg-lime-500/10 border border-lime-500/20">ATOMIC HOT-SWAP</span>
          </div>

          {/* Vector 14 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-fuchsia-500/50 hover:shadow-[0_0_30px_rgba(217,70,239,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center mb-4 border border-fuchsia-500/20 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">14. Meta CAPI & Google Synthetic Honey Poisoner</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Fabricates structured, cryptographically plausible click IDs (`fbclid`, `gclid`), polluting Big Tech server conversion feeds.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-fuchsia-400 uppercase font-semibold px-2 py-0.5 rounded bg-fuchsia-500/10 border border-fuchsia-500/20">HONEY POISONED</span>
          </div>

          {/* Vector 15 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4 border border-violet-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">15. JA4 / TLS 1.3 ClientHello Normalizer</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Standardizes outbound TLS extension order and cipher suites to match canonical browser fingerprints, defeating network-level JA4 trackers.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-violet-400 uppercase font-semibold px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">JA4 NORMALIZED</span>
          </div>

          {/* Vector 16 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/20 group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">16. Post-Quantum Kyber-768 Lattice Cryptography</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Protects communications against quantum decryption with NIST FIPS 203 ML-KEM polynomial lattice key encapsulation.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-teal-400 uppercase font-semibold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">NIST ML-KEM-768</span>
          </div>

          {/* Vector 17 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">17. Zero-Knowledge Merkle State Anonymity</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Cryptographically proves threat inclusion without leaking client IP, device fingerprint, or session identity.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-emerald-400 uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">ZK-BLINDED</span>
          </div>

          {/* Vector 18 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Binary className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">18. Fully Homomorphic Encryption (FHE / BFV)</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Performs encrypted domain lookups directly over ciphertext polynomial rings without decrypting the queried domain.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-amber-400 uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">FHE CIPHERTEXT</span>
          </div>

          {/* Vector 19 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-sky-500/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/20 group-hover:scale-110 transition-transform">
              <Orbit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">19. Quantum Key Distribution (QKD BB84)</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Maintains Bell state entanglement $|\Phi^+\rangle$ with $F &gt; 0.95$ and detects eavesdroppers if QBER exceeds 11%.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-sky-400 uppercase font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">QKD ENTANGLED</span>
          </div>

          {/* Vector 20 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">20. NIST FIPS 204 ML-DSA-87 Digital Signatures</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Authenticates internal rules via $8 \times 7$ high-dimensional lattice matrix digital signatures over $R_q$.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-emerald-400 uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">FIPS 204 SIGNED</span>
          </div>

          {/* Vector 21 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 border border-orange-500/20 group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">21. Neuromorphic Biometric Camouflage</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Synthesizes 10.2Hz physiological neuromotor micro-tremors and 3rd-order jerk derivatives, bypassing Turnstile and bot ML.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-orange-400 uppercase font-semibold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">10.2HZ TREMOR</span>
          </div>

          {/* Vector 22 */}
          <div className="p-6 rounded-2xl bg-[#0c0c0e]/90 backdrop-blur-xl border border-[#27272a] hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.12)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4 border border-red-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">22. GAN Adversarial FGSM Embedding Poisoning</h3>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              Injects $L_\infty$-bounded FGSM perturbations to force neural loss maximization ($L &gt; 4.0$) on ad recommendation networks.
            </p>
            <span className="mt-4 inline-block text-[10px] font-mono text-red-400 uppercase font-semibold px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">FGSM MAX LOSS</span>
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

      {/* Military Ecosystem Deployment Section */}
      <section id="mobile" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-[#27272a]">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            DEFCON-1 SOVEREIGN DEPLOYMENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4 font-display">
            One App Install. Total Coverage.<br className="hidden sm:block" /> Every Device. Every Platform.
          </h2>
          <p className="text-sm text-[#a1a1aa] mt-3 max-w-2xl mx-auto leading-relaxed">
            FUF deploys across all 4 attack surfaces simultaneously — Android App, iOS Armor, Windows Desktop, and Browser Extension. 28 military-grade defense vectors running 24/7.
          </p>
        </div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              icon: '🤖',
              label: 'Android App',
              sub: 'APK · VpnService Loopback',
              desc: 'Local VPN tunnel intercepts all app traffic. Flipkart, Meesho, game ads — sinkholed instantly. Zero root required.',
              badge: 'DEFCON-1',
              badgeColor: 'text-red-400 border-red-500/30 bg-red-500/10',
              stat: '22+ vectors',
            },
            {
              icon: '🍎',
              label: 'iOS Armor',
              sub: '.mobileconfig · NEDNSProxyProvider',
              desc: 'Encrypted DoH profile signed & delivered. Works without any background app. 0% battery drain. iOS 17+ native.',
              badge: 'NATIVE',
              badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
              stat: '0% battery',
            },
            {
              icon: '🪟',
              label: 'Windows .EXE',
              sub: 'Electron · Daemon on :5354',
              desc: 'System-tray daemon running local DNS on port 5354. Intercepts all browser and app traffic. Ships as NSIS installer.',
              badge: 'OFFLINE',
              badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
              stat: 'NSIS installer',
            },
            {
              icon: '🧩',
              label: 'Browser Extension',
              sub: 'Chrome · Firefox · Edge',
              desc: '28 injection vectors fired in the browser layer. GAN ad poisoner, tremor camouflage, FGSM perturbation — live.',
              badge: 'MV3',
              badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
              stat: '28 vectors',
            },
          ].map((item) => (
            <div key={item.label} className="p-5 rounded-2xl bg-[#0c0c0e] border border-[#27272a] hover:border-amber-500/30 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-display">{item.label}</h3>
              <p className="text-[10px] text-amber-400 font-mono mt-0.5 mb-2">{item.sub}</p>
              <p className="text-[11px] text-[#71717a] leading-relaxed">{item.desc}</p>
              <div className="mt-3 pt-3 border-t border-[#27272a] flex items-center justify-between">
                <span className="text-[10px] text-[#a1a1aa] font-mono">{item.stat}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#0c0c0e] border border-[#27272a]">
          {[
            { value: '28', label: 'Military Vectors', color: 'text-amber-400' },
            { value: '150k+', label: 'Domains Blocked', color: 'text-red-400' },
            { value: '0ms', label: 'Bank Delay', color: 'text-emerald-400' },
            { value: '4', label: 'Platforms Covered', color: 'text-blue-400' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-2xl sm:text-3xl font-bold font-display ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-[#71717a] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
          <button
            onClick={() => setShowMobileModal(true)}
            className="px-6 py-3 rounded-xl font-bold text-xs text-black bg-white hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <Smartphone className="w-4 h-4" />
            <span>Configure Mobile Device</span>
          </button>
          <button className="px-6 py-3 rounded-xl font-bold text-xs text-white border border-[#27272a] hover:border-amber-500/40 bg-[#0c0c0e] transition-all cursor-pointer flex items-center justify-center gap-2">
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download for Windows</span>
          </button>
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
              Unlike aggressive adblockers that break banking authentication and OTPs, FUF automatically classifies trusted financial and essential institutions into <strong>Zone A</strong> for transparent pass-through.
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
                      dns.FUF.local
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
        <span>FUF Apex v4.0 Institutional Matrix • 100% Free & Open-Source</span>
        <div className="flex items-center gap-6">
          <a href="/dashboard.html" className="hover:text-white transition-colors">Control Center</a>
          <a href="/dist_installer/FUF Setup 1.0.0.exe" className="hover:text-white transition-colors">Windows App</a>
          <a href="#vectors" className="hover:text-white transition-colors">17 Vectors</a>
        </div>
      </footer>
    </div>
  );
}
