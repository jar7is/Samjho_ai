'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReliefBridge } from '@/lib/store';
import { DEMO_USERS } from '@/lib/demo-data';
import { Shield, UserCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { currentUser, switchUser } = useReliefBridge();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Milestone 1 synthetic demo mode, sign in seamlessly
    router.push('/dashboard');
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pt-6 pb-20">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {isRegistering ? 'Create Coordinator Account' : 'Relief Coordinator Sign In'}
        </h1>
        <p className="text-xs text-zinc-400">
          Secure, authenticated access for disaster response coordinators and field verifiers.
        </p>
      </div>

      {/* Quick Demo Persona Switcher */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-amber-800/60 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-400" />
            Quick Demo Sign-In (1-Click)
          </span>
          <span className="text-[10px] font-mono text-zinc-400">ZERO PASSWORDS</span>
        </div>

        <div className="space-y-2">
          {DEMO_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => handleQuickLogin(user.id)}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                currentUser.id === user.id
                  ? 'bg-amber-950/60 border-amber-600 text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div>
                <div className="font-semibold text-white">{user.name}</div>
                <div className="text-[11px] text-zinc-400">
                  {user.role.replace('_', ' ')} • {user.badgeNumber}
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Standard Form */}
      <form
        onSubmit={handleSimulatedSubmit}
        className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4"
      >
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="coordinator@reliefbridge.org"
            className="w-full text-xs p-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full text-xs p-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow transition-colors cursor-pointer"
        >
          {isRegistering ? 'Register Coordinator' : 'Sign In to Workspace'}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
          >
            {isRegistering
              ? 'Already registered? Sign In'
              : 'Need coordinator clearance? Register here'}
          </button>
        </div>
      </form>
    </div>
  );
}
