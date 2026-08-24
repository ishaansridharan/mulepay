import React from 'react';
import {
  Zap,
  ShieldCheck,
  Radio,
  Building2,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

interface AboutPageProps {
  onLaunchDemo: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onLaunchDemo }) => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Soft Ambient Light Gradient Drops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-[500px] right-0 w-[500px] h-[500px] bg-gradient-to-l from-emerald-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Simple Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-cyan-300 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Offline UPI Protocol & Dual-Engine Simulator</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15] mb-4">
          Pay anywhere, even with{' '}
          <span className="gradient-text-cyan-emerald">ZERO Internet.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8 font-normal">
          MeshPay UPI turns nearby smartphones into secure relay runners. Send instant payments in crowded stadiums, subways, and cellular dead zones with 100% bank security.
        </p>

        {/* Hero CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onLaunchDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Launch Interactive Simulator</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full font-medium text-xs sm:text-sm text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 bg-slate-900/40"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>How it Works</span>
          </a>
        </div>

        {/* Seamless Metrics Line (No Box Borders) */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 w-full max-w-3xl flex flex-wrap justify-around gap-6 text-center">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-cyan-400 block">100%</span>
            <span className="text-[11px] text-slate-400">Dead-Zone Operation</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800 hidden sm:block"></div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">0%</span>
            <span className="text-[11px] text-slate-400">Merchant Fraud Risk</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800 hidden sm:block"></div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-cyan-300 block">5-Node</span>
            <span className="text-[11px] text-slate-400">BLE Hop Relay</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800 hidden sm:block"></div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 block">AES-256</span>
            <span className="text-[11px] text-slate-400">Escrow Security</span>
          </div>
        </div>
      </section>

      {/* --- SEAMLESS HOW IT WORKS FLOW --- */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            3-Step Relay
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-3">
            How MeshPay Works in 3 Steps
          </h2>
        </div>

        {/* Seamless 3-Step Flow (Un-boxed layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-start space-y-3 p-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 font-extrabold flex items-center justify-center text-sm border border-cyan-500/30">
                01
              </div>
              <span className="text-xs font-semibold text-cyan-300">Lock Payment</span>
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              1. Lock & Sign Token
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your phone cryptographically signs the payment inside your hardware enclave. Funds are reserved on-device so money can never be double-spent.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-start space-y-3 p-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 font-extrabold flex items-center justify-center text-sm border border-emerald-500/30">
                02
              </div>
              <span className="text-xs font-semibold text-emerald-300">BLE Relay</span>
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              2. Hop Across Phones
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Without cellular signal, your phone broadcasts the encrypted packet over Bluetooth (BLE). Nearby phones relay it forward like a baton.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-start space-y-3 p-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 font-extrabold flex items-center justify-center text-sm border border-teal-500/30">
                03
              </div>
              <span className="text-xs font-semibold text-teal-300">Bank Gateway</span>
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              3. Instant Settlement
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When any phone in the chain gets connectivity, the packet hits the bank gateway for instant settlement with 0% merchant risk.
            </p>
          </div>
        </div>
      </section>

      {/* --- DUAL ENGINES & QUICKSTART STRIP --- */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Dual Engines Column */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Protocol Architecture
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              Dual Protocol Engines
            </h3>

            <div className="space-y-4 pt-2">
              <div className="border-l-2 border-cyan-400 pl-4 py-1 space-y-1">
                <span className="text-xs font-bold text-cyan-300">Engine 2 • Hardware Escrow (NPCI Lite)</span>
                <p className="text-xs text-slate-300">
                  Pre-locks up to ₹2,000 on-device with 72-hour lease auto-expiry. Guaranteed 100% instant settlement in zero-cell zones.
                </p>
              </div>

              <div className="border-l-2 border-amber-400 pl-4 py-1 space-y-1">
                <span className="text-xs font-bold text-amber-300">Engine 1 • Direct-Debit Mule</span>
                <p className="text-xs text-slate-300">
                  Uncapped payments cleared directly from your primary bank account via a 2-way cryptographic Mule-Ack confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Quickstart Guide Column */}
          <div className="space-y-4 md:border-l border-slate-800/80 md:pl-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Simulator Guide
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              How to Test in 3 Steps
            </h3>

            <div className="space-y-3 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span>Select <strong>Engine 1/2</strong> and toggle <strong>Offline BLE DTN</strong> network mode.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span>Click <strong>Initiate Mesh Payment</strong> and observe live packet muling across the 5 node hops.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span>Test <strong>Replay Attack</strong> or <strong>MITM Tamper</strong> to verify cryptographic telemetry defense.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onLaunchDemo}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Try Simulator Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* --- FOOTER CALLOUT --- */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Ready to test MeshPay UPI?
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md">
            Launch the interactive 5-node simulator to visualize BLE packet muling and real-time cryptographic logs.
          </p>

          <button
            onClick={onLaunchDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch Interactive Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
