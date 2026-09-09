'use client';

import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, ExternalLink, Key } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export function SupabaseBanner() {
  const [copied, setCopied] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [customConnected, setCustomConnected] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('custom_supabase_url');
      const savedKey = localStorage.getItem('custom_supabase_anon_key');
      if (savedUrl && savedKey) {
        setSupabaseUrl(savedUrl);
        setSupabaseKey(savedKey);
        setCustomConnected(true);
      }
    }
  }, []);

  const isConnected = isSupabaseConfigured || customConnected;

  // In production mode with Supabase connected, hide the developer setup banner entirely for end-users
  if (process.env.NODE_ENV === 'production' && isConnected) {
    return null;
  }

  // Also hide banner in dev if connected, unless user clicks toggle
  if (isConnected && !showConfigModal && !isDev) {
    return null;
  }

  const handleCopySql = () => {
    const sqlScript = `-- RECLAIM MEN - Supabase Schema Migration
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    public_arc_id VARCHAR(12) UNIQUE NOT NULL,
    anonymous_username TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    timezone TEXT DEFAULT 'UTC',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    personal_day INT NOT NULL CHECK (personal_day BETWEEN 1 AND 92),
    no_porn BOOLEAN NOT NULL DEFAULT FALSE,
    no_masturbation BOOLEAN NOT NULL DEFAULT FALSE,
    no_doomscrolling BOOLEAN NOT NULL DEFAULT FALSE,
    wake_5am BOOLEAN NOT NULL DEFAULT FALSE,
    meditation BOOLEAN NOT NULL DEFAULT FALSE,
    journaling BOOLEAN NOT NULL DEFAULT FALSE,
    no_food_entertainment BOOLEAN NOT NULL DEFAULT FALSE,
    movement BOOLEAN NOT NULL DEFAULT FALSE,
    score INT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 8),
    private_reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS public.streaks (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    best_streak INT NOT NULL DEFAULT 0,
    completed_days INT NOT NULL DEFAULT 0,
    consistency_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`;

    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveCustomKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrl.trim() && supabaseKey.trim()) {
      localStorage.setItem('custom_supabase_url', supabaseUrl.trim());
      localStorage.setItem('custom_supabase_anon_key', supabaseKey.trim());
      setCustomConnected(true);
      setShowConfigModal(false);
      window.location.reload();
    }
  };

  return (
    <div className="bg-zinc-950 border-b border-white/10 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="font-mono font-bold text-zinc-200">DATABASE BACKEND:</span>
          {isConnected ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              SUPABASE CONNECTED (LIVE PRODUCTION DB)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-400 font-mono font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <AlertCircle className="w-3 h-3" />
              SETUP NEEDED: CONNECT YOUR SUPABASE DB BELOW
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <button
            onClick={handleCopySql}
            className="text-zinc-300 hover:text-emerald-400 flex items-center gap-1 underline transition-colors"
          >
            <Copy className="w-3 h-3" />
            {copied ? 'SQL Migration Copied!' : 'Copy SQL Migration'}
          </button>

          <button
            onClick={() => setShowConfigModal(!showConfigModal)}
            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-emerald-500/40 transition-colors flex items-center gap-1"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>{isConnected ? 'Supabase Status' : 'Connect Supabase Keys'}</span>
          </button>
        </div>
      </div>

      {showConfigModal && (
        <div className="max-w-xl mx-auto my-3 p-4 bg-zinc-900 rounded-xl border border-emerald-500/40 space-y-3 animate-fadeIn text-left">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              SUPABASE API KEYS CONFIGURATION
            </h4>
            <button onClick={() => setShowConfigModal(false)} className="text-zinc-500 hover:text-white">✕</button>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            In Supabase Dashboard, go to <strong>Project Settings (⚙️) → API</strong>. Copy your <strong>Project URL</strong> and <strong>anon public API key</strong> below.
          </p>

          <form onSubmit={handleSaveCustomKeys} className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono text-zinc-300 mb-1">SUPABASE PROJECT URL</label>
              <input
                type="text"
                required
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-300 mb-1">SUPABASE ANON PUBLIC KEY</label>
              <input
                type="text"
                required
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono transition-colors"
              >
                SAVE & CONNECT SUPABASE
              </button>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 underline"
              >
                Open Supabase Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
