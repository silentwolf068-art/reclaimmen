'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { generateArcId } from '@/lib/arcId';

export default function JoinPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [previewArcId] = useState(generateArcId());
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      dataService.registerUser(email, handle);
      setLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center space-y-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">JOIN RECLAIM MEN</h1>
        <p className="text-xs text-zinc-400">Begin your 92-day Winter Arc personal journey today.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        {/* PUBLIC IDENTITY PREVIEW */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Public Community Identity</span>
          <div className="text-xl font-mono font-extrabold text-emerald-400 tracking-wider">
            {previewArcId}
          </div>
          <p className="text-[11px] text-zinc-400">
            Assigned automatically. Your real name and email remain 100% private.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[10px] text-zinc-500 mt-1">Used solely for authentication recovery.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Anonymous Username <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. SilentWolf, IronMind24"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Arc Account...' : 'BEGIN MY WINTER ARC (DAY 1)'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-white/5 text-center text-xs text-zinc-400">
          Already a member?{' '}
          <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
