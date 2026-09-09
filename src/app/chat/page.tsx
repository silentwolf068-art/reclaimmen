'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  MessageSquare,
  Flame,
  Shield,
  Send,
  Sparkles,
  BookOpen,
  Sun,
  AlertTriangle,
  Lock,
  ThumbsUp
} from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { ChatMessage, UserProfile } from '@/types';

export default function LiveChatPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [channel, setChannel] = useState<'general' | 'urges' | 'morning5am' | 'books'>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const curUser = dataService.getCurrentUser();
    if (curUser) setUser(curUser);
    loadMessages();
  }, [channel]);

  const loadMessages = () => {
    const msgs = dataService.getChatMessages(channel);
    setMessages(msgs);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user) return;

    dataService.addChatMessage(user.id, channel, inputMessage.trim());
    setInputMessage('');
    loadMessages();
  };

  const handleReaction = (msgId: string, type: 'fire' | 'bicep' | 'shield') => {
    dataService.reactToChatMessage(msgId, type);
    loadMessages();
  };

  const channelsList = [
    { id: 'general', label: '💬 General Lounge', desc: 'Discipline, habits & brotherly support' },
    { id: 'urges', label: '🔥 Overcoming Trges', desc: 'Urgent accountability when fighting triggers' },
    { id: 'morning5am', label: '🌅 5 AM Morning Club', desc: 'Morning victories & early focus' },
    { id: 'books', label: '📚 Books & Wisdom', desc: 'Mindset reading & philosophy' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>REAL-TIME BROTHERHOOD LOUNGE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">LIVE ANONYMOUS CHAT</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Connect anonymously with active Arc members worldwide. Zero judgment, pure accountability.
          </p>
        </div>

        {user && (
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chatting as {user.publicArcId}</span>
          </div>
        )}
      </div>

      {/* CHANNEL TABS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {channelsList.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setChannel(ch.id as any)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              channel === ch.id
                ? 'bg-emerald-950/30 border-emerald-500/50 text-white glow-emerald'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <div className="font-bold text-xs">{ch.label}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{ch.desc}</div>
          </button>
        ))}
      </div>

      {/* CHAT MESSAGES WINDOW */}
      <div className="glass-panel rounded-2xl border border-white/10 flex flex-col h-[500px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-20 space-y-2 text-zinc-500 font-mono text-xs">
              <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
              <p>No messages in #{channel} yet. Be the first to start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {msg.publicArcId}
                    </span>
                    {msg.anonymousUsername && (
                      <span className="text-zinc-400">@{msg.anonymousUsername}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-sm text-zinc-200 leading-relaxed">{msg.message}</p>

                {/* Reaction buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleReaction(msg.id, 'fire')}
                    className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                  >
                    <span>🔥</span>
                    <span>{msg.reactions.fire}</span>
                  </button>
                  <button
                    onClick={() => handleReaction(msg.id, 'bicep')}
                    className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <span>💪</span>
                    <span>{msg.reactions.bicep}</span>
                  </button>
                  <button
                    onClick={() => handleReaction(msg.id, 'shield')}
                    className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  >
                    <span>🛡️</span>
                    <span>{msg.reactions.shield}</span>
                  </button>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-zinc-950/80 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message #${channel}... (Stay supportive and disciplined)`}
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
