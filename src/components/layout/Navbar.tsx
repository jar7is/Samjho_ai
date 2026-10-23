'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReliefBridge } from '@/lib/store';
import { DEMO_USERS } from '@/lib/demo-data';
import {
  LifeBuoy,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Shield,
  UserCheck,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchUser, isDemoMode } = useReliefBridge();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Shield },
    { href: '/dashboard', label: 'Incident Dashboard', icon: LayoutDashboard },
    { href: '/submit', label: 'Intake / Submit', icon: PlusCircle },
    { href: '/settings', label: 'Settings & Privacy', icon: Settings },
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-950/50 group-hover:scale-105 transition-transform">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    Samjho AI
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    EVIDENCE CORE
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  Evidence & Conflict Review System
                </span>
              </div>
            </Link>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-800 text-white border border-zinc-700 shadow-inner'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right section: User role switcher & live indicator */}
          <div className="flex items-center gap-3">
            {/* User switcher dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <div className="flex flex-col text-left">
                  <span className="font-medium text-white truncate max-w-[140px] sm:max-w-[180px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                    Switch Active Persona
                  </div>
                  <div className="mt-1 space-y-1">
                    {DEMO_USERS.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                          currentUser.id === user.id
                            ? 'bg-amber-950/60 text-amber-200 border border-amber-800/80'
                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        <span className="font-medium">{user.name}</span>
                        <span className="text-[10px] text-zinc-400">
                          {user.email} • {user.badgeNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-zinc-800 px-2 text-[10px] text-zinc-500">
                    Role determines audit attribution on review actions.
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/auth"
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-zinc-800/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex flex-col items-center gap-0.5 text-[11px] font-medium ${
                  isActive ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
