import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Layers,
  Search,
  Building2,
  FileCheck,
  Activity,
  ChevronRight,
  ExternalLink,
  Lock,
  Cpu,
  Database,
  Terminal,
  Globe,
  Compass,
  Check,
  Clock,
  Zap,
  BookOpen
} from 'lucide-react';

interface LandingPageProps {
  onLaunchPlatform: () => void;
  onSelectPresetCase?: (caseId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchPlatform,
  onSelectPresetCase
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'graph' | 'attribution' | 'evidence'>('graph');

  // How it works steps data
  const steps = [
    {
      num: '01',
      title: 'TRACE',
      subtitle: 'Fund Flow Reconstruction',
      desc: 'Reconstruct the movement of funds from a suspect wallet across multi-hop unhosted addresses, peel chains, and automated router contracts.',
      icon: GitCommit,
      tag: 'Multi-Hop Analysis'
    },
    {
      num: '02',
      title: 'CORRELATE',
      subtitle: 'Cross-Chain Linkage',
      desc: 'Connect activity across Bitcoin, Ethereum, Solana, TRON, BNB Chain, and Polygon through bridge telemetry and swap contract correlations.',
      icon: Layers,
      tag: 'Cross-Chain Correlation'
    },
    {
      num: '03',
      title: 'IDENTIFY',
      subtitle: 'VASP & Entity Matching',
      desc: 'Match target addresses against verified global exchange deposit clusters, hot wallets, and regulated VASP intelligence registries.',
      icon: Building2,
      tag: 'Entity Registry'
    },
    {
      num: '04',
      title: 'EXPLAIN',
      subtitle: 'Attribution & Evidence Engine',
      desc: 'Examine explicit evidence factors, path integrity, and remaining uncertainties behind every attribution confidence score.',
      icon: Activity,
      tag: 'Explainable Score'
    },
    {
      num: '05',
      title: 'ACT',
      subtitle: 'Legal & Enforcement Package',
      desc: 'Package findings into forensically stamped reports (SHA-256) with automated Section 91 Cr.P.C. disclosure drafts & freeze requests.',
      icon: FileCheck,
      tag: 'Forensic Output'
    }
  ];

  // Multi-chain supported networks
  const chains = [
    { name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-600', border: 'border-blue-200 shadow-blue-100', desc: 'ERC-20, Smart Contracts, DeFi Router' },
    { name: 'Bitcoin', symbol: 'BTC', color: 'bg-amber-600', border: 'border-amber-200 shadow-amber-100', desc: 'UTXO Peel Chains, CoinJoin Detection' },
    { name: 'Solana', symbol: 'SOL', color: 'bg-purple-600', border: 'border-purple-200 shadow-purple-100', desc: 'SPL Tokens, High-Velocity Swaps' },
    { name: 'TRON', symbol: 'TRX', color: 'bg-red-600', border: 'border-red-200 shadow-red-100', desc: 'TRC-20 USDT High-Volume Outflows' },
    { name: 'BNB Chain', symbol: 'BNB', color: 'bg-yellow-600', border: 'border-yellow-200 shadow-yellow-100', desc: 'BEP-20 Transfers & DEX Routers' },
    { name: 'Polygon', symbol: 'MATIC', color: 'bg-indigo-600', border: 'border-indigo-200 shadow-indigo-100', desc: 'L2 Bridge Transfers & Cross-Swaps' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* SECTION 1 — NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="Chain Intel Logo" className="w-8 h-8 object-contain rounded" />
            <div>
              <span className="text-base font-extrabold text-slate-900 font-mono tracking-tight leading-none block">
                CHAIN INTEL
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase mt-0.5">
                TRACE / ATTRIBUTE / INVESTIGATE
              </span>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
            <a href="#product" className="hover:text-blue-600 transition">Product</a>
            <a href="#gap" className="hover:text-blue-600 transition">The Gap</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#attribution" className="hover:text-blue-600 transition">Attribution</a>
            <a href="#multichain" className="hover:text-blue-600 transition">Multi-Chain</a>
            <a href="#evidence" className="hover:text-blue-600 transition">Evidence</a>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onLaunchPlatform}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-md transition shadow-xs flex items-center space-x-2"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* SECTION 2 — HERO */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Content Left */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Technical Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-xs font-mono font-bold">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>FORENSIC BLOCKCHAIN INTELLIGENCE</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                From a Wallet Address <br className="hidden sm:inline" />
                to <span className="text-blue-700 underline decoration-blue-300 underline-offset-4">Actionable Intelligence.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Trace cryptocurrency flows across chains, correlate entities, and identify relevant VASPs with evidence-backed attribution and court-ready legal documentation.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onLaunchPlatform}
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white text-sm font-bold rounded-lg transition shadow-md flex items-center justify-center space-x-2 group"
                >
                  <span>Start Investigation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-6 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-sm font-bold rounded-lg transition text-center shadow-2xs"
                >
                  Explore How It Works
                </a>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-lg font-bold font-mono text-slate-900">91%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Attribution Precision</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-slate-900">6 Major</div>
                  <div className="text-[11px] text-slate-500 font-medium">Chains Normalised</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-slate-900">SHA-256</div>
                  <div className="text-[11px] text-slate-500 font-medium">Chain of Custody Stamp</div>
                </div>
              </div>

            </div>

            {/* Hero Visual Right — Refined Miniature Investigation Graph Preview */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden p-6 relative">
                
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-700 uppercase">Live Trace Pipeline</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    CASE REF: TB-001
                  </span>
                </div>

                {/* Graph Flow Visualization */}
                <div className="space-y-3 font-mono text-xs">
                  
                  {/* Node 1: Suspect Wallet */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between hover:border-blue-400 transition">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center font-bold">
                        W1
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">SUSPECT WALLET (ORIGIN)</div>
                        <div className="text-[10px] text-slate-500">0x71C7656EC7ab88b098defb751b7401b5f6d8976f</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded">
                      HIGH RISK
                    </span>
                  </div>

                  {/* Flow Arrow 1 */}
                  <div className="flex justify-center my-1 text-slate-400">
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      <span>42.5 ETH ($148.7K)</span>
                      <ChevronRight className="w-3 h-3 text-blue-600" />
                      <span className="text-blue-700 font-bold">Ethereum Mainnet</span>
                    </div>
                  </div>

                  {/* Node 2: Cross-Chain Bridge */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between hover:border-blue-400 transition">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded bg-purple-100 border border-purple-300 text-purple-700 flex items-center justify-center font-bold">
                        BR
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">CROSS-CHAIN BRIDGE</div>
                        <div className="text-[10px] text-slate-500">Synapse Router → Solana / TRON Bridge</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold rounded">
                      CROSS-CHAIN
                    </span>
                  </div>

                  {/* Flow Arrow 2 */}
                  <div className="flex justify-center my-1 text-slate-400">
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      <span>148,500 USDT</span>
                      <ChevronRight className="w-3 h-3 text-purple-600" />
                      <span className="text-purple-700 font-bold">TRON TRC-20 Network</span>
                    </div>
                  </div>

                  {/* Node 3: Target VASP Destination */}
                  <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold">
                        V
                      </div>
                      <div>
                        <div className="font-bold text-blue-950 text-[11px]">TARGET VASP / SERVICE</div>
                        <div className="text-[10px] text-blue-800">CoinDCX / Regulated Exchange Deposit Node</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold rounded flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>MATCHED</span>
                    </span>
                  </div>

                </div>

                {/* Attribution Score Footer Banner */}
                <div className="mt-4 p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-xs font-bold font-mono">ATTRIBUTION SCORE</div>
                      <div className="text-[10px] text-slate-400">Direct Deposit Relationship Verified</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold font-mono text-emerald-400 leading-none">91 / 100</div>
                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">HIGHLY LIKELY</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3 — THE INVESTIGATION GAP */}
      <section id="gap" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              The Forensic Challenge
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              "The money moves faster than the investigation."
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              When bad actors transfer stolen funds through multiple peel chains and cross-chain bridges, manual tracing creates blind spots.
            </p>
          </div>

          {/* Horizontal Flow Illustration */}
          <div className="mt-12 overflow-x-auto pb-4">
            <div className="min-w-[700px] flex items-center justify-between max-w-5xl mx-auto px-4">
              
              {[
                { label: 'Victim Wallet', type: 'ORIGIN', color: 'bg-slate-100 text-slate-800 border-slate-300' },
                { label: 'Suspect Wallet', type: 'HOP 1', color: 'bg-rose-50 text-rose-900 border-rose-300' },
                { label: 'Multiple Wallets', type: 'HOP 2-4', color: 'bg-slate-100 text-slate-800 border-slate-300' },
                { label: 'Cross-Chain Bridge', type: 'SWAP', color: 'bg-purple-50 text-purple-900 border-purple-300' },
                { label: 'Another Chain', type: 'HOP 5', color: 'bg-slate-100 text-slate-800 border-slate-300' },
                { label: 'Service / Exchange', type: 'VASP', color: 'bg-blue-50 text-blue-900 border-blue-300' },
                { label: 'Unknown Destination', type: 'TARGET', color: 'bg-slate-900 text-white border-slate-800' },
              ].map((node, i) => (
                <React.Fragment key={i}>
                  <div className={`p-3 rounded-lg border text-center shadow-2xs ${node.color} shrink-0 w-32`}>
                    <div className="text-[9px] font-mono font-bold opacity-7 uppercase">{node.type}</div>
                    <div className="text-xs font-bold mt-1 leading-tight">{node.label}</div>
                  </div>
                  {i < 6 && (
                    <div className="flex-1 px-1 flex flex-col items-center">
                      <div className="w-full h-0.5 bg-slate-300 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-slate-500 rotate-45" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

            </div>
          </div>

          <div className="mt-6 text-xs text-slate-500 font-mono">
            Each hop adds another layer between the investigator and the destination.
          </div>

          {/* Solution Banner */}
          <div className="mt-8 max-w-2xl mx-auto p-4 bg-blue-900 text-white rounded-xl shadow-sm text-sm font-medium flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <Shield className="w-5 h-5 text-blue-400 shrink-0" />
              <span>Chain Intel turns that transaction trail into an automated, actionable investigation graph.</span>
            </div>
            <button
              onClick={onLaunchPlatform}
              className="ml-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition shrink-0"
            >
              Test Trace
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
              5-Step Forensic Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              How Chain Intel Reconstructs Fund Trails
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              A continuous investigation pipeline designed to transform raw blockchain data into court-ready evidence.
            </p>
          </div>

          {/* 5 Continuous Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer relative bg-white ${
                    activeStep === idx
                      ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold font-mono text-slate-300">
                      {step.num}
                    </span>
                    <span className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 tracking-wider">
                    {step.tag}
                  </span>

                  <h3 className="text-sm font-extrabold text-slate-900 mt-1 mb-1">
                    {step.title}
                  </h3>

                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    {step.subtitle}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 5 — PRODUCT PREVIEW */}
      <section id="product" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Live Workstation Interface
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              "See the investigation, not just the transaction."
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Follow the flow of funds, inspect the evidence behind each relationship, and understand where attribution confidence comes from.
            </p>
          </div>

          {/* Interactive Mock Workstation Container */}
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-200">
            
            {/* Top Workstation Window Bar */}
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-slate-400 pl-2 border-l border-slate-800">
                  CHAIN INTEL FORENSIC WORKSTATION v2.5.0
                </span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-md border border-slate-800">
                <button
                  onClick={() => setActiveTab('graph')}
                  className={`px-3 py-1 rounded text-[11px] font-bold transition ${
                    activeTab === 'graph' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cytoscape Graph View
                </button>
                <button
                  onClick={() => setActiveTab('attribution')}
                  className={`px-3 py-1 rounded text-[11px] font-bold transition ${
                    activeTab === 'attribution' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Attribution Ladder
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`px-3 py-1 rounded text-[11px] font-bold transition ${
                    activeTab === 'evidence' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Evidence & Log Trail
                </button>
              </div>
            </div>

            {/* Content View */}
            <div className="p-6 sm:p-8 min-h-[380px]">
              
              {activeTab === 'graph' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Interactive Node Map */}
                  <div className="lg:col-span-2 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>INTERACTIVE TRANSACTION MAP (DAGRE LAYOUT)</span>
                      <span className="text-emerald-400 font-bold">● 5 HOPS RESOLVED</span>
                    </div>

                    <div className="py-6 flex flex-col items-center space-y-4 font-mono text-xs">
                      
                      <div className="p-3 bg-slate-900 border border-rose-500/50 rounded-lg text-rose-300 w-full max-w-md text-center">
                        <div className="font-bold text-rose-400">● SUSPECT WALLET (ETH)</div>
                        <div className="text-[10px] opacity-80 font-mono">0x71C7656EC7ab88b098defb751b7401b5f6d8976f</div>
                      </div>

                      <div className="w-0.5 h-6 bg-slate-700 relative">
                        <span className="absolute left-2 top-1 text-[9px] text-slate-400 bg-slate-900 px-1 border border-slate-800 rounded">
                          42.5 ETH
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900 border border-purple-500/50 rounded-lg text-purple-300 w-full max-w-md text-center">
                        <div className="font-bold text-purple-400">● SYNAPSE CROSS-CHAIN BRIDGE</div>
                        <div className="text-[10px] opacity-80 font-mono">Ethereum → Solana / TRON Router</div>
                      </div>

                      <div className="w-0.5 h-6 bg-slate-700 relative">
                        <span className="absolute left-2 top-1 text-[9px] text-slate-400 bg-slate-900 px-1 border border-slate-800 rounded">
                          148.5K USDT
                        </span>
                      </div>

                      <div className="p-3 bg-blue-950 border border-emerald-500/80 rounded-lg text-emerald-300 w-full max-w-md text-center shadow-lg">
                        <div className="font-bold text-emerald-400 flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>NEAREST VASP: COINDCX DEPOSIT NODE</span>
                        </div>
                        <div className="text-[10px] text-slate-300 mt-0.5">Confidence Score: 91 / 100 (HIGHLY LIKELY)</div>
                      </div>

                    </div>
                  </div>

                  {/* Right Graph Controls */}
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                      Selected Node Inspector
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Entity Type</div>
                        <div className="font-bold text-white">VASP Exchange Deposit Wallet</div>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">VASP Candidate</div>
                        <div className="font-bold text-blue-400">CoinDCX (Registered Exchange)</div>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Direct Deposit Flag</div>
                        <div className="font-bold text-emerald-400">VERIFIED (+25 Bonus)</div>
                      </div>

                      <button
                        onClick={onLaunchPlatform}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition flex items-center justify-center space-x-2"
                      >
                        <span>Open Full Graph Workstation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attribution' && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-slate-400">ATTRIBUTION TIER</span>
                      <h4 className="text-base font-bold text-emerald-400">HIGHLY LIKELY (&gt;85%)</h4>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-2xl font-extrabold text-white">91</span>
                      <span className="text-slate-400 text-xs"> / 100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="text-emerald-400 font-bold font-mono flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>POSITIVE EVIDENCE</span>
                      </div>
                      <ul className="space-y-1 text-slate-300 text-[11px]">
                        <li>✓ Direct deposit pattern matched</li>
                        <li>✓ Known hot wallet cluster tie</li>
                        <li>✓ High temporal correlation (&lt;12 min)</li>
                        <li>✓ Amount preservation across hops</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="text-amber-400 font-bold font-mono flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>UNSATISFIED / RISKS</span>
                      </div>
                      <ul className="space-y-1 text-slate-300 text-[11px]">
                        <li>• Intermediate unhosted hop observed</li>
                        <li>• Cross-chain bridge transition (-5 penalty)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'evidence' && (
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
                  <div className="text-slate-400 text-[11px] pb-2 border-b border-slate-800 flex justify-between">
                    <span>SHA-256 STAMP: 8f9b2a...3e41</span>
                    <span className="text-emerald-400">VERIFIED CHAIN OF CUSTODY</span>
                  </div>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800">
{`{
  "case_ref": "TB-001",
  "suspect_wallet": "0x71C7656EC7ab88b098defb751b7401b5f6d8976f",
  "attributed_vasp": "CoinDCX",
  "confidence_score": 91,
  "hops_analyzed": 5,
  "chains_covered": ["ETH", "TRON", "SOL"],
  "legal_notices": ["SEC_91_DISCLOSURE_DRAFTED", "SEC_102_FREEZE_READY"]
}`}
                  </pre>
                </div>
              )}

            </div>

            {/* Bottom CTA bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ready to trace real transaction vectors?</span>
              <button
                onClick={onLaunchPlatform}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition flex items-center space-x-2"
              >
                <span>Open Workstation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 6 — EXPLAINABLE ATTRIBUTION */}
      <section id="attribution" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Card Left */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">CANDIDATE VASP</span>
                    <h3 className="text-base font-extrabold text-slate-900">CoinDCX / Regulated Exchange Deposit</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">CONFIDENCE</span>
                    <span className="text-xl font-extrabold font-mono text-blue-900">91 / 100</span>
                  </div>
                </div>

                {/* Evidence vs Uncertainty checklist */}
                <div className="space-y-4">
                  
                  {/* Evidence Box */}
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                    <h4 className="text-xs font-bold text-emerald-900 font-mono flex items-center space-x-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>EXPLICIT EVIDENCE FACTORS</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                      <li className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Direct deposit relationship verified on-chain</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Transaction path & value preserved across hops</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Known entity association in intelligence database</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Temporal correlation within 12-minute window</span>
                      </li>
                    </ul>
                  </div>

                  {/* Uncertainty Box */}
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg">
                    <h4 className="text-xs font-bold text-amber-900 font-mono flex items-center space-x-1.5 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>REMAINING UNCERTAINTIES</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 ml-1 mr-1" />
                        <span>Cross-chain bridge hop observed (Synapse Protocol)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 ml-1 mr-1" />
                        <span>Intermediate unhosted wallet observed in peel path</span>
                      </li>
                    </ul>
                  </div>

                </div>

              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                Core Differentiator
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explainable Attribution. <br />
                No Black-Box Probabilities.
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Investigators cannot submit opaque ML confidence scores to court. Chain Intel presents transparent mathematical factor breakdowns showing exactly why an attribution was made, supported by direct evidence and highlighted uncertainties.
              </p>

              <div className="pt-2">
                <button
                  onClick={onLaunchPlatform}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center space-x-2"
                >
                  <span>Inspect Scoring Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 7 — MULTI-CHAIN INTELLIGENCE */}
      <section id="multichain" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Ecosystem Normalisation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              One investigation. Multiple chains.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Follow value across chains instead of treating every blockchain as an isolated investigation.
            </p>
          </div>

          {/* Grid of supported chains */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {chains.map((chain, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border bg-white shadow-2xs hover:shadow-md transition-all ${chain.border}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-lg ${chain.color} text-white font-mono font-bold flex items-center justify-center text-xs shadow-xs`}>
                      {chain.symbol.slice(0, 2)}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{chain.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">{chain.symbol}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded border border-emerald-200">
                    LIVE
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {chain.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8 — EVIDENCE-FIRST INVESTIGATION */}
      <section id="evidence" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                Evidence-First Architecture
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Turn Data Into Court-Ready Evidence.
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Chain Intel is not merely visualizing transaction lines. Every hop, contract interaction, and VASP match produces forensically stamped log trails designed for legal disclosures and asset restraint orders.
              </p>

              <div className="space-y-3 text-xs font-medium text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Section 91 Cr.P.C. / BNSS Disclosure Draft Generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Section 102 Cr.P.C. / BNSS Account Freeze Request Draft</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Deterministic SHA-256 Report Integrity Verification</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onLaunchPlatform}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center space-x-2"
                >
                  <span>Inspect Evidence Panel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Evidence Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200 rounded-xl shadow-md p-6 font-mono text-xs space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-4 h-4 text-blue-700" />
                    <span className="font-bold text-slate-900">TRANSACTION EVIDENCE RECORD</span>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded border border-blue-200">
                    FORENSIC LOG
                  </span>
                </div>

                {/* Evidence Grid */}
                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">CHAIN NETWORK</span>
                    <span className="font-bold text-slate-900">Ethereum Mainnet</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">TRANSACTION HASH</span>
                    <span className="font-bold text-blue-700 truncate block">0x7a8f...92c1</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">BLOCK HEIGHT</span>
                    <span className="font-bold text-slate-900">19,482,910</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">TIMESTAMP (UTC)</span>
                    <span className="font-bold text-slate-900">2026-03-14 14:22:08</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">VALUE MOVED</span>
                    <span className="font-bold text-emerald-700">42.5 ETH ($148,750)</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">ATTRIBUTION</span>
                    <span className="font-bold text-purple-700">Wallet → VASP Deposit</span>
                  </div>
                </div>

                {/* Hash Footer */}
                <div className="p-3 bg-slate-900 text-slate-200 rounded flex items-center justify-between text-[10px]">
                  <span>SHA-256 HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                  <span className="text-emerald-400 font-bold shrink-0 ml-2">VERIFIED</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 9 — INVESTIGATOR WORKFLOW TIMELINE */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Investigator Process Timeline
            </h2>
          </div>

          {/* Timeline visualization */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[700px] max-w-5xl mx-auto grid grid-cols-7 gap-2 font-mono text-xs">
              {[
                { step: '01', title: 'CASE', desc: 'Register case & target input' },
                { step: '02', title: 'WALLET', desc: 'Identify suspect address' },
                { step: '03', title: 'TRACE', desc: 'Multi-hop graph generation' },
                { step: '04', title: 'GRAPH', desc: 'Cluster & entity matching' },
                { step: '05', title: 'EVIDENCE', desc: 'Extract on-chain proofs' },
                { step: '06', title: 'ATTRIBUTION', desc: 'Calculate VASP score' },
                { step: '07', title: 'ACTION', desc: 'Generate legal requests' },
              ].map((m, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center hover:border-blue-500 transition">
                  <span className="text-[10px] text-blue-600 font-bold block">{m.step}</span>
                  <span className="font-extrabold text-slate-900 block mt-0.5">{m.title}</span>
                  <span className="text-[9px] text-slate-500 block mt-1 leading-tight">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 10 — FINAL CTA */}
      <section className="py-16 lg:py-20 bg-blue-900 text-white border-b border-blue-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <span className="text-xs font-mono font-bold text-blue-200 uppercase tracking-widest bg-blue-800 px-3 py-1 rounded-full border border-blue-700">
            Ready to Begin?
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start with the wallet. Follow the evidence.
          </h2>

          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Turn complex transaction trails into an investigation you can act on.
          </p>

          <div>
            <button
              onClick={onLaunchPlatform}
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-blue-950 text-sm font-extrabold rounded-lg transition shadow-lg inline-flex items-center space-x-2"
            >
              <span>Launch Chain Intel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Chain Intel Logo" className="w-7 h-7 object-contain rounded" />
              <div>
                <span className="font-extrabold text-sm text-white font-mono tracking-tight block">
                  CHAIN INTEL
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Blockchain intelligence for actionable investigations.
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-slate-400 font-medium">
              <a href="#product" className="hover:text-white transition">Platform</a>
              <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
              <a href="#attribution" className="hover:text-white transition">Capabilities</a>
              <a href="#evidence" className="hover:text-white transition">Evidence</a>
              <button onClick={onLaunchPlatform} className="hover:text-white transition text-blue-400 font-bold">
                Launch Workstation
              </button>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 CHAIN INTEL. All rights reserved.</p>
            <p className="font-mono text-slate-400">PRECISION • EVIDENCE • ATTRIBUTION</p>
          </div>

        </div>
      </footer>

    </div>
  );
};
