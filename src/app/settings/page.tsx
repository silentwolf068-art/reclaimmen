'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, User, Lock, Globe, Trash2, Download, LogOut, CheckCircle2 } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { UserProfile } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [handle, setHandle] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const curUser = dataService.getCurrentUser();
    if (curUser) {
      setUser(curUser);
      setHandle(curUser.anonymousUsername || '');
      setTimezone(curUser.timezone || 'UTC');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    user.anonymousUsername = handle.trim() || undefined;
    user.timezone = timezone;
    setMessage('Settings saved successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExport = () => {
    if (!user) return;
    const checkins = dataService.getUserCheckins(user.id);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ user, checkins }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `reclaim_men_data_${user.publicArcId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = () => {
    if (!user) return;
    if (confirm('Are you sure you want to permanently delete your account and all check-in history? This action cannot be undone.')) {
      dataService.deleteUserAccount(user.id);
      router.push('/');
    }
  };

  const handleLogout = () => {
    dataService.logoutUser();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Settings className="w-3.5 h-3.5" />
          <span>ACCOUNT CONTROL CENTER</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">ACCOUNT SETTINGS</h1>
        <p className="text-xs text-zinc-400">Manage your profile, timezone, privacy settings, and data.</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      )}

      {/* ACCOUNT IDENTIFIER */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          PUBLIC IDENTITY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">PUBLIC ARC ID</span>
            <span className="text-base font-bold text-emerald-400">{user.publicArcId}</span>
          </div>

          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">ARC START DATE</span>
            <span className="text-base font-bold text-white">{user.startDate}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Anonymous Handle <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. IronMind, SilentWolf"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-mono"
            />
            <p className="text-[10px] text-zinc-500 mt-1">Used for accurate 5 AM wakeup and midnight rollover calculations.</p>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
          >
            Save Account Settings
          </button>
        </form>
      </div>

      {/* DATA EXPORT & ACCOUNT MANAGEMENT */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="font-bold text-white text-sm">DATA CONTROL & PRIVACY</h3>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export My Personal Data (JSON)
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-amber-400" />
            Sign Out
          </button>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">DANGER ZONE</h4>
          <p className="text-xs text-zinc-400">Permanently remove your profile and all check-in logs from our system.</p>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
