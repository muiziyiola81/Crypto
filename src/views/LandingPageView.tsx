import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Shield,
  ShieldCheck,
  Fingerprint,
  Lock,
  Smartphone,
  Download,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronRight,
  Globe,
  FileText,
  Mail,
  X,
  Sparkles,
  Cpu,
  Eye,
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const { user, isVaultUnlocked, navigateTo } = useAuth();
  const { isInstallable, install, isIOS } = usePWAInstall();

  // Modals for footer / install actions
  const [showApkModal, setShowApkModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Handle opening the app / vault
  const handleOpenCryptoLocker = () => {
    if (user) {
      if (isVaultUnlocked) {
        navigateTo('dashboard');
      } else {
        navigateTo('biometric_unlock');
      }
    } else {
      navigateTo('welcome');
    }
  };

  // Handle Install action
  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        // Fallback to scrolling to the install section
        scrollToInstall();
      }
    } else {
      scrollToInstall();
    }
  };

  const scrollToInstall = () => {
    const el = document.getElementById('get-cryptolocker');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden font-sans relative">
      {/* Subtle ambient electric blue and cyan glow highlights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-1/3 right-0 w-[450px] h-[350px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-black flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
                CL
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-blue-400 transition">
                  CryptoLocker
                </span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider -mt-1 hidden sm:block">
                  DIGITAL VAULT
                </span>
              </div>
            </button>
          </div>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">
            <a href="#preview" className="hover:text-white transition">
              Preview
            </a>
            <a href="#features" className="hover:text-white transition">
              Security Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-white transition">
              Benefits
            </a>
            <a href="#get-cryptolocker" className="hover:text-cyan-400 transition">
              Install
            </a>
          </nav>

          {/* Top CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCryptoLocker}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-medium transition cursor-pointer"
            >
              <span>{user ? 'Open Vault' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </button>

            <button
              onClick={handleInstallClick}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 z-10">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Call-to-Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-blue-500/30 text-xs text-zinc-300 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-semibold text-white">CryptoLocker</span>
                <span className="text-zinc-600">·</span>
                <span className="text-blue-400 font-medium">Hardware Biometric Vault</span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  CryptoLocker
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white mt-1">
                    Your secure digital vault.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Keep your important digital information organized and protected in one secure vault.
                </p>
              </div>

              {/* Primary Call-to-Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 max-w-md mx-auto lg:mx-0">
                {/* Primary CTA: Install CryptoLocker with Electric Blue Accent */}
                <button
                  onClick={handleInstallClick}
                  className="h-13 px-7 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer group"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Install CryptoLocker</span>
                </button>

                {/* Secondary Button: Open CryptoLocker (Web App) */}
                <button
                  onClick={handleOpenCryptoLocker}
                  className="h-13 px-6 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 hover:text-white border border-zinc-700/80 font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Open CryptoLocker</span>
                </button>
              </div>

              {/* Security Pill Highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Biometric-Only Enclave</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Zero Memory Leaks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Encrypted Persistence</span>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Shield & Vault Visual */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md aspect-square flex items-center justify-center">
                {/* Glowing Outer Rings */}
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin" style={{ animationDuration: '30s' }} />
                <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/20" />
                <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-blue-600/15 via-transparent to-cyan-500/10 blur-xl" />

                {/* Glassmorphic Shield Centerpiece */}
                <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-3xl bg-zinc-900/80 backdrop-blur-2xl border border-zinc-700/80 shadow-2xl p-6 flex flex-col items-center justify-between overflow-hidden">
                  {/* Subtle top light bar */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                  {/* Top Status */}
                  <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      ENCLAVE LOCKED
                    </span>
                    <span className="text-zinc-500">FIDO2</span>
                  </div>

                  {/* Vault Core Icon */}
                  <div className="relative my-auto flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3 group">
                      <Shield className="w-10 h-10 text-blue-400 group-hover:scale-105 transition" />
                      <Lock className="w-4 h-4 text-white absolute bottom-5 right-5" />
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">CryptoLocker Vault</span>
                    <span className="text-[11px] text-zinc-400 font-mono mt-0.5">Biometric Hardware Lock</span>
                  </div>

                  {/* Bottom Security Specs */}
                  <div className="w-full pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
                    <span>WebAuthn Enclave</span>
                    <span className="text-blue-400">SHA-256 / AES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* APP PREVIEW (REALISTIC PHONE-STYLE VAULT INTERFACE)                       */}
        {/* ========================================================================= */}
        <section id="preview" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 mb-3">
              <Smartphone className="w-3.5 h-3.5" />
              <span>AUTHENTIC VAULT EXPERIENCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Built for seamless security on Android and web.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Experience a streamlined, dark digital vault designed specifically for organizing cryptocurrency seeds, hardware keys, and recovery credentials.
            </p>
          </div>

          {/* Realistic Phone-Style Frame */}
          <div className="max-w-sm sm:max-w-md mx-auto">
            <div className="relative rounded-[40px] bg-zinc-950 border-[6px] border-zinc-800 shadow-2xl shadow-blue-950/20 p-4 pt-3 overflow-hidden">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-10 h-1 bg-zinc-800 rounded-full" />
              </div>

              {/* Realistic Inner Screen Content */}
              <div className="space-y-4">
                {/* App Screen Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-[10px]">
                      CL
                    </div>
                    <span className="text-xs font-bold text-white">CryptoLocker</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/40 text-[10px] text-cyan-300 font-mono">
                    <Fingerprint className="w-3 h-3 text-cyan-400" />
                    <span>Protected</span>
                  </div>
                </div>

                {/* Vault Status Card */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-white">Encrypted Vault Active</span>
                    <span className="text-[10px] font-mono text-cyan-400">SECURE</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-tight">
                    Keys and seed phrases masked in memory. Biometric unlock required for access.
                  </p>
                </div>

                {/* Mocked Authentic Records List */}
                <div className="space-y-2.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
                    Your Secured Records (3)
                  </div>

                  {/* Record 1 */}
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-xs font-semibold text-white">Primary Bitcoin Cold Storage</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">BTC</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded-lg">
                      <span className="text-zinc-500">Seed Phrase:</span>
                      <span className="text-zinc-300 tracking-wider">•••• •••• •••• ••••</span>
                    </div>
                  </div>

                  {/* Record 2 */}
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-xs font-semibold text-white">Ledger Live Ethereum Key</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">ETH</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded-lg">
                      <span className="text-zinc-500">Wallet Address:</span>
                      <span className="text-zinc-300 font-mono text-[10px]">0x7F2b...4A91</span>
                    </div>
                  </div>

                  {/* Record 3 */}
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-xs font-semibold text-white">Exchange Backup Credentials</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">2FA</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded-lg">
                      <span className="text-zinc-500">Recovery Codes:</span>
                      <span className="text-zinc-300 tracking-wider">•••• •••• ••••</span>
                    </div>
                  </div>
                </div>

                {/* Phone Bottom Nav Simulation */}
                <div className="pt-2 flex items-center justify-around border-t border-zinc-900 text-zinc-500 text-[10px]">
                  <span className="text-blue-400 font-semibold">Records</span>
                  <span>Add Vault</span>
                  <span>Security</span>
                  <span>Settings</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECURITY FEATURES (3 PREMIUM CARDS)                                       */}
        {/* ========================================================================= */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CORE SECURITY ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Security designed from the hardware up.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every design decision prioritizes cryptographic privacy, memory isolation, and biometric integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1: Biometric Protection */}
            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 p-6 sm:p-8 space-y-4 shadow-xl transition-all duration-200 group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shadow-md shadow-blue-500/10">
                <Fingerprint className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Biometric Protection</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Bind your device hardware enclave using Touch ID, Face ID, Android Biometrics, or Windows Hello. Raw biological data never leaves your physical chip.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>FIDO2 / WebAuthn Standard</span>
              </div>
            </div>

            {/* Feature 2: Secure Vault */}
            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 p-6 sm:p-8 space-y-4 shadow-xl transition-all duration-200 group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-md shadow-cyan-500/10">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Secure Vault</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Sensitive keys, seed phrases, and recovery codes are securely masked in memory. Active browser sessions cannot bypass the biometric lock.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Memory Masking & Isolation</span>
              </div>
            </div>

            {/* Feature 3: Private Records */}
            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 p-6 sm:p-8 space-y-4 shadow-xl transition-all duration-200 group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shadow-md shadow-blue-500/10">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Private Records</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Organize hardware wallets, exchanges, and blockchain keys with dedicated fields for public identifiers, PINs, 2FA, and recovery phrases.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Encrypted Cloud Storage</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS (3 SIMPLE STEPS)                                             */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
              <span>SIMPLE ONBOARDING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How CryptoLocker Works
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Get set up in three seamless steps. No complex configurations or insecure passwords required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3 relative overflow-hidden">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-zinc-800 block">
                01
              </span>
              <h3 className="text-lg font-bold text-white">Create your vault</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Register your account to initialize your private cryptographic storage with secure cloud persistence.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3 relative overflow-hidden">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-blue-600/40 block">
                02
              </span>
              <h3 className="text-lg font-bold text-white">Set up biometric protection</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Bind your phone or computer biometric sensor with one tap. WebAuthn registers your device passkey securely.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3 relative overflow-hidden">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-600/40 block">
                03
              </span>
              <h3 className="text-lg font-bold text-white">Secure your information</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Add your cryptocurrency wallets, private keys, and seed phrases with peace of mind. Everything is sealed behind biometric unlock.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* APP BENEFITS SECTION                                                      */}
        {/* ========================================================================= */}
        <section id="benefits" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why Choose CryptoLocker?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Designed for crypto users who take security and convenience seriously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Organize */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Organize
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Keep all your hardware wallets, backup recovery phrases, and network addresses logically grouped in one accessible vault.
              </p>
            </div>

            {/* Protect */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Protect
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enforce biometric-only vault access. No passwords to forget, no PIN backdoors, and no session lock bypasses.
              </p>
            </div>

            {/* Access */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Access
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Instant availability directly on Android via PWA or native browser tabs with complete responsive touch optimization.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INSTALL SECTION ("GET CRYPTOLOCKER")                                      */}
        {/* ========================================================================= */}
        <section id="get-cryptolocker" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-zinc-900">
          <div className="rounded-3xl bg-gradient-to-b from-zinc-900/90 to-black border border-blue-500/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
            {/* Subtle background glow in install box */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-blue-600/20 blur-3xl pointer-events-none rounded-full" />

            <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-blue-500/40 flex items-center justify-center mx-auto shadow-inner text-blue-400">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Get CryptoLocker
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium">
                Secure your important digital information with CryptoLocker.
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Download the Android app or use CryptoLocker directly from your browser.
              </p>
            </div>

            {/* Buttons: Download APK & Open Web App */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              {/* Download APK Button */}
              <button
                onClick={() => setShowApkModal(true)}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download APK</span>
              </button>

              {/* Open Web App Button */}
              <button
                onClick={handleOpenCryptoLocker}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 hover:text-white border border-zinc-700/80 font-semibold text-sm flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Open Web App</span>
              </button>
            </div>

            {/* PWA quick hint */}
            <p className="text-[11px] text-zinc-500 font-mono pt-2">
              Supports Android PWA installation · No root required · Secure offline memory masking
            </p>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="border-t border-zinc-900 bg-black py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Brand info */}
          <div className="space-y-1">
            <span className="text-base font-bold text-white tracking-tight">CryptoLocker</span>
            <p className="text-xs text-zinc-400">Your secure digital vault.</p>
          </div>

          {/* Links / Placeholders */}
          <div className="flex items-center justify-center gap-6 text-xs text-zinc-400">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-white transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-white transition cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="hover:text-white transition cursor-pointer"
            >
              Contact Support
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-900 text-[11px] text-zinc-600">
            © {new Date().getFullYear()} CryptoLocker. All rights reserved. Hardware biometric verification via FIDO2 WebAuthn.
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL: DOWNLOAD APK INFO & HANDLER                                        */}
      {/* ========================================================================= */}
      {showApkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowApkModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Download className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Download Android APK</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Install the CryptoLocker Android package or add directly to your home screen via Progressive Web App (PWA).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs text-zinc-300">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Package Target:</span>
                <span className="text-white font-semibold">CryptoLocker Vault (Android)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Biometric Support:</span>
                <span className="text-cyan-400">Fingerprint / Face Unlock</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowApkModal(false);
                  handleInstallClick();
                }}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install Instant Web App (PWA)</span>
              </button>

              <button
                onClick={() => {
                  setShowApkModal(false);
                  handleOpenCryptoLocker();
                }}
                className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Open in Mobile Browser</span>
              </button>
            </div>

            <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
              For direct APK downloads or custom enterprise builds, contact support or install directly through the browser install banner.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRIVACY POLICY                                                     */}
      {/* ========================================================================= */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Privacy Policy</span>
            </h3>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <p>
                <strong>1. Zero Raw Biometric Collection:</strong> CryptoLocker utilizes the standard FIDO2/WebAuthn API. Your fingerprints, facial recognition scans, or biometric credentials never leave your local hardware enclave and are never transmitted to our servers.
              </p>
              <p>
                <strong>2. Vault Data Storage:</strong> Records stored within your vault are associated with your authenticated user ID in our secure Supabase database. Sensitive fields (passwords, PINs, seed phrases, recovery codes) are masked in memory on client devices.
              </p>
              <p>
                <strong>3. Telemetry & Analytics:</strong> CryptoLocker does not sell, market, or rent your personal information to third-party ad networks.
              </p>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full mt-4 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TERMS OF SERVICE                                                   */}
      {/* ========================================================================= */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Terms of Service</span>
            </h3>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <p>
                <strong>1. Vault Custody:</strong> You remain solely responsible for the retention and backup of your cryptocurrency credentials, seed phrases, and device biometric access.
              </p>
              <p>
                <strong>2. Security Best Practices:</strong> You agree not to share device access, credential passkeys, or account access with unauthorized parties.
              </p>
              <p>
                <strong>3. Service Availability:</strong> CryptoLocker provides secure digital vault management tools on an as-is basis without warranties regarding external blockchain network operations.
              </p>
            </div>

            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full mt-4 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONTACT SUPPORT                                                    */}
      {/* ========================================================================= */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>Contact Support</span>
            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Need assistance with biometric enrollment, vault backup, or device passkey configuration? Our security team is available to assist you.
            </p>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
              <span className="text-zinc-500 text-[10px]">VAULT ENQUIRIES:</span>
              <p className="text-white font-semibold">support@cryptolocker.vault</p>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full mt-4 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
