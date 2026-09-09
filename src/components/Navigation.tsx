'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, CheckSquare, Users, Award, BookOpen, Settings, ShieldCheck, MessageSquare } from 'lucide-react';
import { dataService } from '@/lib/dataService';

export function Header() {
  const pathname = usePathname();
  const user = dataService.getCurrentUser();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Shield },
    { href: '/check-in', label: 'Roll Call', icon: CheckSquare },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/chat', label: 'Brotherhood Chat', icon: MessageSquare },
    { href: '/milestones', label: 'Milestones', icon: Award },
    { href: '/rules', label: 'Rules', icon: BookOpen },
    { href: '/admin', label: 'Admin', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold tracking-wider text-base text-white flex items-center gap-2">
              RECLAIM MEN
              <span className="text-[10px] uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                Winter Arc 2026
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium tracking-wide">Take Back Control.</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Identity / Settings Pill */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{user.publicArcId}</span>
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          ) : (
            <Link
              href="/join"
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs transition-colors"
            >
              Join Arc
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  const mobileLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Shield },
    { href: '/check-in', label: 'Roll Call', icon: CheckSquare },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/milestones', label: 'Badges', icon: Award }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 px-2 py-2">
      <div className="flex items-center justify-around">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
