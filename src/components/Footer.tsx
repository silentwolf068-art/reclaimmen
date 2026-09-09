import React from 'react';
import Link from 'next/link';
import { Shield, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 py-12 px-4 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Shield className="w-5 h-5 text-emerald-400" />
            RECLAIM MEN
          </div>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
            A discipline and accountability system designed to reduce compulsive digital stimulation, build emotional mastery, and strengthen focus.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400/90 font-mono pt-1">
            <Lock className="w-3.5 h-3.5" />
            Privacy-First Architecture • Anonymous Public Identity
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm tracking-wider uppercase text-zinc-300">Navigation</h4>
          <ul className="space-y-2 font-medium">
            <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
            <li><Link href="/check-in" className="hover:text-emerald-400 transition-colors">Daily Roll Call</Link></li>
            <li><Link href="/community" className="hover:text-emerald-400 transition-colors">Community Roll Call</Link></li>
            <li><Link href="/milestones" className="hover:text-emerald-400 transition-colors">Milestone Badges</Link></li>
            <li><Link href="/admin" className="hover:text-emerald-400 transition-colors">Admin Analytics</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm tracking-wider uppercase text-zinc-300">Philosophy</h4>
          <ul className="space-y-2 font-medium">
            <li><Link href="/rules" className="hover:text-emerald-400 transition-colors">The 8 Daily Commitments</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">Mission & Values</Link></li>
            <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy & Anonymity</Link></li>
            <li><Link href="/settings" className="hover:text-emerald-400 transition-colors">Data Control & Settings</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 font-mono">
        <p>© 2026 RECLAIM MEN. Winter Arc Protocol. All rights reserved.</p>
        <p className="text-[11px] text-zinc-400">Take back control of your attention, time, and life.</p>
      </div>
    </footer>
  );
}
