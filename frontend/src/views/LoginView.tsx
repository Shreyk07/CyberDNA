import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { CyberDNALogo } from '../components/CyberDNALogo';

interface LoginViewProps {
  onLoginSuccess: (userEmail: string) => void;
  onNavigateHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateHome
}) => {
  const [email, setEmail] = useState('analyst.demo@cyberdna.research');
  const [password, setPassword] = useState('Forensics2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide an email and password.');
      return;
    }

    setLoading(true);
    // Demonstration authentication flow
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email);
    }, 400);
  }

  function handleInstantDemo() {
    setEmail('analyst.demo@cyberdna.research');
    setPassword('Forensics2026!');
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('analyst.demo@cyberdna.research');
    }, 250);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-between text-[#D8D8D8] font-sans selection:bg-[#F2D35E] selection:text-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="p-6 border-b border-[#292929] bg-[#0A0A0A] flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="text-xs font-mono text-[#A0A0A0] hover:text-white flex items-center gap-2 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#F2D35E]" />
          <span>Return to Homepage</span>
        </button>

        <CyberDNALogo size="sm" showSubtitle={false} />
      </div>

      {/* Main Login Card Section */}
      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md bg-[#111111] border border-[#292929] p-8 sm:p-10 shadow-2xl space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <CyberDNALogo size="md" />

            <div className="pt-2">
              <span className="text-[10px] font-mono tracking-widest text-[#F2D35E] uppercase block">
                Research Workspace Authentication
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-light tracking-tight text-white mt-1">
                Forensic Intelligence.<br />
                <em className="italic text-[#F2D35E]">Authenticated Access.</em>
              </h1>
              <p className="text-xs text-[#A0A0A0] font-light leading-relaxed mt-2">
                Enter the behavioral fingerprinting research environment to inspect security telemetry and active case dossiers.
              </p>
            </div>
          </div>

          {/* Quick Demo Access Callout */}
          <div className="p-4 bg-[#171717] border border-[#292929] space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-white">
              <ShieldCheck className="w-4 h-4 text-[#F2D35E]" />
              <span>Instant Demo Environment</span>
            </div>
            <p className="text-[11px] text-[#A0A0A0] font-light leading-snug">
              Pre-configured with 2,231 verified security events, behavioral baseline profiles, and 6 MITRE attack chains.
            </p>
            <button
              type="button"
              onClick={handleInstantDemo}
              className="w-full py-3 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] transition-all text-xs font-medium tracking-tight flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(242,211,94,0.15)]"
            >
              <span>Enter Demo Environment (1-Click)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#292929]" />
            <span className="bg-[#111111] px-3 text-[10px] font-mono uppercase text-[#777777] absolute">
              or sign in with credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-[#A0A0A0] mb-1.5 uppercase tracking-wider text-[11px]">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst.demo@cyberdna.research"
                  className="w-full pl-9 pr-3 py-2 bg-[#171717] border border-[#292929] text-xs text-[#D8D8D8] font-mono focus:outline-none focus:border-[#F2D35E] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-[#A0A0A0] uppercase tracking-wider text-[11px]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#777777] hover:text-[#D8D8D8] flex items-center gap-1 font-mono"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#171717] border border-[#292929] text-xs text-[#D8D8D8] font-mono focus:outline-none focus:border-[#F2D35E] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#171717] border border-[#292929] text-[#D8D8D8] hover:bg-[#222222] hover:text-white transition-colors text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F2D35E]" />
            </button>
          </form>

          {/* Demo Credentials Footer */}
          <div className="pt-4 border-t border-[#292929] text-[11px] text-[#777777] font-mono space-y-1">
            <div className="text-[#A0A0A0] font-medium">Demo Research Credentials:</div>
            <div>Username: <code className="text-[#F2D35E]">analyst.demo@cyberdna.research</code></div>
            <div>Password: <code className="text-[#F2D35E]">Forensics2026!</code></div>
            <p className="text-[10px] text-[#777777] font-sans font-light pt-1 leading-normal">
              Fictional demonstration credentials for Master's thesis presentation. No external Identity Provider setup required.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[#292929] bg-[#0A0A0A] text-center text-[11px] text-[#777777] font-mono">
        CyberDNA Behavioral Fingerprinting & Digital Forensics Platform • 2026
      </div>
    </div>
  );
};
