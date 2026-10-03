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
  Globe,
  FileText,
  Mail,
  X,
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const { user, isVaultUnlocked, navigateTo } = useAuth();
  const { isInstallable, install } = usePWAInstall();

  // Modals
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // ============================================================
  // OPEN CRYPTOLOCKER
  // ============================================================
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

  // ============================================================
  // PWA INSTALL
  // ============================================================
  const handlePWAInstall = async () => {
    if (isInstallable) {
      try {
        await install();
      } catch (error) {
        console.error('PWA installation failed:', error);
      }
    } else {
      const el = document.getElementById('get-cryptolocker');

      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden font-sans relative">

      {/* ====================================================== */}
      {/* AMBIENT BACKGROUND GLOW                               */}
      {/* ====================================================== */}

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="fixed top-1/3 right-0 w-[450px] h-[350px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* ====================================================== */}
      {/* TOP NAVIGATION                                         */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-xl border-b border-zinc-800/80">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
            >

              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-black flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
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

          {/* Desktop navigation */}

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">

            <a
              href="#preview"
              className="hover:text-white transition"
            >
              Preview
            </a>

            <a
              href="#features"
              className="hover:text-white transition"
            >
              Security Features
            </a>

            <a
              href="#how-it-works"
              className="hover:text-white transition"
            >
              How It Works
            </a>

            <a
              href="#benefits"
              className="hover:text-white transition"
            >
              Benefits
            </a>

            <a
              href="#get-cryptolocker"
              className="hover:text-cyan-400 transition"
            >
              Install
            </a>

          </nav>

          {/* Top buttons */}

          <div className="flex items-center gap-3">

            <button
              onClick={handleOpenCryptoLocker}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-medium transition cursor-pointer"
            >

              <span>
                {user ? 'Open Vault' : 'Sign In'}
              </span>

              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />

            </button>

            <button
              onClick={handlePWAInstall}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition active:scale-[0.98] cursor-pointer"
            >

              <Download className="w-3.5 h-3.5" />

              <span>
                Install App
              </span>

            </button>

          </div>

        </div>

      </header>

      {/* ====================================================== */}
      {/* MAIN CONTENT                                            */}
      {/* ====================================================== */}

      <main className="flex-1 z-10">

        {/* ==================================================== */}
        {/* HERO                                                  */}
        {/* ==================================================== */}

        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left */}

            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-blue-500/30 text-xs text-zinc-300 shadow-sm">

                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

                <span className="font-semibold text-white">
                  CryptoLocker
                </span>

                <span className="text-zinc-600">
                  ·
                </span>

                <span className="text-blue-400 font-medium">
                  Biometric Digital Vault
                </span>

              </div>

              <div className="space-y-3">

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">

                  CryptoLocker

                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white mt-1">
                    Your secure digital vault.
                  </span>

                </h1>

                <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Keep your important digital information organized and protected in one secure vault.
                </p>

              </div>

              {/* CTA buttons */}

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 max-w-md mx-auto lg:mx-0">

                <button
                  onClick={handlePWAInstall}
                  className="h-13 px-7 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer group"
                >

                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />

                  <span>
                    Install CryptoLocker
                  </span>

                </button>

                <button
                  onClick={handleOpenCryptoLocker}
                  className="h-13 px-6 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 hover:text-white border border-zinc-700/80 font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
                >

                  <Globe className="w-4 h-4 text-cyan-400" />

                  <span>
                    Open CryptoLocker
                  </span>

                </button>

              </div>

              {/* Highlights */}

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-zinc-400">

                <div className="flex items-center gap-1.5">

                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />

                  <span>
                    Biometric Protection
                  </span>

                </div>

                <div className="flex items-center gap-1.5">

                  <CheckCircle2 className="w-4 h-4 text-blue-400" />

                  <span>
                    Secure Vault
                  </span>

                </div>

                <div className="flex items-center gap-1.5">

                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />

                  <span>
                    Private Records
                  </span>

                </div>

              </div>

            </div>

            {/* Right visual */}

            <div className="lg:col-span-5 flex items-center justify-center">

              <div className="relative w-full max-w-sm sm:max-w-md aspect-square flex items-center justify-center">

                <div
                  className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin"
                  style={{
                    animationDuration: '30s',
                  }}
                />

                <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/20" />

                <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-blue-600/15 via-transparent to-cyan-500/10 blur-xl" />

                <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-3xl bg-zinc-900/80 backdrop-blur-2xl border border-zinc-700/80 shadow-2xl p-6 flex flex-col items-center justify-between overflow-hidden">

                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                  <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400">

                    <span className="flex items-center gap-1.5 text-cyan-400">

                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />

                      ENCLAVE LOCKED

                    </span>

                    <span className="text-zinc-500">
                      FIDO2
                    </span>

                  </div>

                  <div className="relative my-auto flex flex-col items-center">

                    <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">

                      <Shield className="w-10 h-10 text-blue-400" />

                      <Lock className="w-4 h-4 text-white absolute bottom-5 right-5" />

                    </div>

                    <span className="text-sm font-bold text-white tracking-tight">
                      CryptoLocker Vault
                    </span>

                    <span className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      Biometric Protection
                    </span>

                  </div>

                  <div className="w-full pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center justify-between">

                    <span>
                      WebAuthn
                    </span>

                    <span className="text-blue-400">
                      SECURED
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================== */}
        {/* PREVIEW                                               */}
        {/* ==================================================== */}

        <section
          id="preview"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900"
        >

          <div className="text-center max-w-2xl mx-auto mb-12">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 mb-3">

              <Smartphone className="w-3.5 h-3.5" />

              <span>
                VAULT PREVIEW
              </span>

            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Built for security on Android and web.
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              A streamlined digital vault for organizing sensitive cryptocurrency information.
            </p>

          </div>

          <div className="max-w-sm sm:max-w-md mx-auto">

            <div className="relative rounded-[40px] bg-zinc-950 border-[6px] border-zinc-800 shadow-2xl shadow-blue-950/20 p-4 pt-3 overflow-hidden">

              <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-4 flex items-center justify-center">

                <div className="w-10 h-1 bg-zinc-800 rounded-full" />

              </div>

              <div className="space-y-4">

                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">

                  <div className="flex items-center gap-2">

                    <div className="w-6 h-6 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-[10px]">
                      CL
                    </div>

                    <span className="text-xs font-bold text-white">
                      CryptoLocker
                    </span>

                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/40 text-[10px] text-cyan-300 font-mono">

                    <Fingerprint className="w-3 h-3 text-cyan-400" />

                    <span>
                      Protected
                    </span>

                  </div>

                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">

                  <div className="flex items-center justify-between">

                    <span className="text-[11px] font-semibold text-white">
                      Secure Vault
                    </span>

                    <span className="text-[10px] font-mono text-cyan-400">
                      LOCKED
                    </span>

                  </div>

                  <p className="text-[10px] text-zinc-400 leading-tight">
                    Access is protected by biometric authentication.
                  </p>

                </div>

                <div className="space-y-2.5">

                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
                    Secured Records
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-semibold text-white">
                        Bitcoin Wallet
                      </span>

                      <span className="text-[10px] font-mono text-zinc-400">
                        BTC
                      </span>

                    </div>

                    <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded-lg">
                      •••• •••• •••• ••••
                    </div>

                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-semibold text-white">
                        Ethereum Wallet
                      </span>

                      <span className="text-[10px] font-mono text-zinc-400">
                        ETH
                      </span>

                    </div>

                    <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded-lg">
                      0x••••••••
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================== */}
        {/* FEATURES                                              */}
        {/* ==================================================== */}

        <section
          id="features"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900"
        >

          <div className="text-center max-w-2xl mx-auto mb-14">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-400 mb-3">

              <ShieldCheck className="w-3.5 h-3.5" />

              <span>
                SECURITY FEATURES
              </span>

            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Security at the center.
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Designed to give you a secure place to organize sensitive digital information.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 p-6 sm:p-8 space-y-4 shadow-xl transition-all duration-200 group">

              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">

                <Fingerprint className="w-7 h-7" />

              </div>

              <h3 className="text-lg font-bold text-white">
                Biometric Protection
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Use your device's supported biometric authentication to protect access to your vault.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-blue-400">

                <CheckCircle2 className="w-3.5 h-3.5" />

                <span>
                  WebAuthn
                </span>

              </div>

            </div>

            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 p-6 sm:p-8 space-y-4 shadow-xl transition-all duration-200 group">

              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">

                <Lock className="w-7 h-7" />

              </div>

              <h3 className="text-lg font-bold text-white">
                Secure Vault
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Keep your important digital information organized behind your vault's biometric access control.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-cyan-400">

                <CheckCircle2 className="w-3.5 h-3.5" />

                <span>
                  Biometric Lock
                </span>

              </div>

            </div>

            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 p-6 sm:p-8 space-y-4 shadow-xl transition-all duration-200 group">

              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">

                <KeyRound className="w-7 h-7" />

              </div>

              <h3 className="text-lg font-bold text-white">
                Private Records
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Organize wallet information, recovery credentials, and other important records in one place.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-blue-400">

                <CheckCircle2 className="w-3.5 h-3.5" />

                <span>
                  Organized Storage
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================== */}
        {/* HOW IT WORKS                                          */}
        {/* ==================================================== */}

        <section
          id="how-it-works"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900"
        >

          <div className="text-center max-w-2xl mx-auto mb-14">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
              SIMPLE ONBOARDING
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How CryptoLocker Works
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Get started in three simple steps.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3">

              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-zinc-800 block">
                01
              </span>

              <h3 className="text-lg font-bold text-white">
                Create your vault
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Create your CryptoLocker account and initialize your vault.
              </p>

            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3">

              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-blue-600/40 block">
                02
              </span>

              <h3 className="text-lg font-bold text-white">
                Set up biometric protection
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Register your device's supported biometric authentication.
              </p>

            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3">

              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-600/40 block">
                03
              </span>

              <h3 className="text-lg font-bold text-white">
                Secure your information
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Add and organize your important digital records inside your vault.
              </p>

            </div>

          </div>

        </section>

        {/* ==================================================== */}
        {/* BENEFITS                                              */}
        {/* ==================================================== */}

        <section
          id="benefits"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900"
        >

          <div className="text-center max-w-2xl mx-auto mb-14">

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why CryptoLocker?
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              A simple way to organize important digital information.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2.5">

              <h3 className="text-base font-bold text-white flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-blue-500" />

                Organize

              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Keep important digital records logically organized in one vault.
              </p>

            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2.5">

              <h3 className="text-base font-bold text-white flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-cyan-400" />

                Protect

              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Use biometric authentication to protect access to your vault.
              </p>

            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2.5">

              <h3 className="text-base font-bold text-white flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-blue-400" />

                Access

              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Access your vault through the web app or supported installed experience.
              </p>

            </div>

          </div>

        </section>

        {/* ==================================================== */}
        {/* INSTALL                                               */}
        {/* ==================================================== */}

        <section
          id="get-cryptolocker"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-zinc-900"
        >

          <div className="rounded-3xl bg-gradient-to-b from-zinc-900/90 to-black border border-blue-500/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">

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
                Install the web app or use CryptoLocker directly from your browser.
              </p>

            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">

              {/* PWA INSTALL */}

              <button
                onClick={handlePWAInstall}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer"
              >

                <Download className="w-4 h-4" />

                <span>
                  Install CryptoLocker
                </span>

              </button>

              {/* WEB APP */}

              <button
                onClick={handleOpenCryptoLocker}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 hover:text-white border border-zinc-700/80 font-semibold text-sm flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer"
              >

                <Globe className="w-4 h-4 text-cyan-400" />

                <span>
                  Open Web App
                </span>

              </button>

            </div>

            <p className="text-[11px] text-zinc-500 font-mono pt-2">
              Progressive Web App · Web App
            </p>

          </div>

        </section>

      </main>

      {/* ====================================================== */}
      {/* FOOTER                                                  */}
      {/* ====================================================== */}

      <footer className="border-t border-zinc-900 bg-black py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500">

        <div className="max-w-7xl mx-auto space-y-6">

          <div className="space-y-1">

            <span className="text-base font-bold text-white tracking-tight">
              CryptoLocker
            </span>

            <p className="text-xs text-zinc-400">
              Your secure digital vault.
            </p>

          </div>

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

            © {new Date().getFullYear()} CryptoLocker. All rights reserved.

          </div>

        </div>

      </footer>

      {/* ====================================================== */}
      {/* PRIVACY MODAL                                           */}
      {/* ====================================================== */}

      {showPrivacyModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">

          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
            >

              <X className="w-5 h-5" />

            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">

              <Shield className="w-5 h-5 text-blue-400" />

              Privacy Policy

            </h3>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">

              <p>
                <strong>1. Biometric Data:</strong> CryptoLocker uses standard WebAuthn/passkey authentication. The website does not receive your raw biometric data.
              </p>

              <p>
                <strong>2. Vault Data:</strong> Records stored in your vault are associated with your authenticated account.
              </p>

              <p>
                <strong>3. Privacy:</strong> CryptoLocker does not sell your personal information to third-party advertising networks.
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

      {/* ====================================================== */}
      {/* TERMS MODAL                                             */}
      {/* ====================================================== */}

      {showTermsModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">

          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">

            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
            >

              <X className="w-5 h-5" />

            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">

              <FileText className="w-5 h-5 text-cyan-400" />

              Terms of Service

            </h3>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">

              <p>
                <strong>1. User Responsibility:</strong> You are responsible for maintaining access to your account and device.
              </p>

              <p>
                <strong>2. Security:</strong> Users should protect their devices and authentication credentials.
              </p>

              <p>
                <strong>3. Availability:</strong> CryptoLocker is provided on an as-is basis.
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

      {/* ====================================================== */}
      {/* CONTACT MODAL                                           */}
      {/* ====================================================== */}

      {showContactModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">

          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-4 shadow-2xl relative">

            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
            >

              <X className="w-5 h-5" />

            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">

              <Mail className="w-5 h-5 text-blue-400" />

              Contact Support

            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Need assistance with CryptoLocker? Contact support for help with your account, vault, or biometric setup.
            </p>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">

              <span className="text-zinc-500 text-[10px]">
                SUPPORT:
              </span>

              <p className="text-white font-semibold">
                support@cryptolocker.vault
              </p>

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
