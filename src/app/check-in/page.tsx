'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Shield,
  Lock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { calculatePersonalDay, TOTAL_ARC_DAYS } from '@/lib/dateUtils';
import { UserProfile, CommitmentsState, CommunityQuestion } from '@/types';

export default function CheckInPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [personalDay, setPersonalDay] = useState(1);
  const [question, setQuestion] = useState<CommunityQuestion | null>(null);

  // 8 Commitments State
  const [commitments, setCommitments] = useState<CommitmentsState>({
    noPorn: false,
    noMasturbation: false,
    noDoomscrolling: false,
    wake5am: false,
    meditation: false,
    journaling: false,
    noFoodEntertainment: false,
    movement: false
  });

  const [privateReflection, setPrivateReflection] = useState('');
  const [communityAnswer, setCommunityAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const curUser = dataService.getCurrentUser();
      if (curUser) {
        setUser(curUser);
        const day = calculatePersonalDay(curUser.startDate);
        setPersonalDay(day);

        const todayChk = await dataService.getTodayCheckin(curUser.id);
        if (todayChk) {
          setCommitments({
            noPorn: todayChk.noPorn,
            noMasturbation: todayChk.noMasturbation,
            noDoomscrolling: todayChk.noDoomscrolling,
            wake5am: todayChk.wake5am,
            meditation: todayChk.meditation,
            journaling: todayChk.journaling,
            noFoodEntertainment: todayChk.noFoodEntertainment,
            movement: todayChk.movement
          });
          if (todayChk.privateReflection) {
            setPrivateReflection(todayChk.privateReflection);
          }
        }
      }
      setQuestion(dataService.getTodayQuestion());
    }
    loadData();
  }, []);

  const toggleCommitment = (key: keyof CommitmentsState) => {
    setCommitments((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const currentScore = Object.values(commitments).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const saved = await dataService.saveDailyCheckin(user.id, commitments, privateReflection);

      if (question && communityAnswer.trim()) {
        dataService.addQuestionResponse(question.id, communityAnswer.trim());
        await dataService.addFeedItem(user.id, communityAnswer.trim(), saved.score, personalDay);
      }

      setSubmittedScore(saved.score);
      setSubmitted(true);

      if (saved.score === 8) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {
          // Fallback
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const ruleDetails = [
    { key: 'noPorn', label: '1. No Pornography', subtext: 'Zero explicit digital stimulation' },
    { key: 'noMasturbation', label: '2. No Masturbation', subtext: 'Conserve vital energy & build self-control' },
    { key: 'noDoomscrolling', label: '3. No Doom Scrolling', subtext: 'No Instagram Reels, TikTok, YouTube Shorts' },
    { key: 'wake5am', label: '4. Wake Up at 5:00 AM', subtext: 'Start the day before distractions begin' },
    { key: 'meditation', label: '5. 10 Min Meditation', subtext: 'Train quiet focus and presence' },
    { key: 'journaling', label: '6. 10 Min Journaling', subtext: 'End-of-day reflection (100% Private)' },
    { key: 'noFoodEntertainment', label: '7. Eat Without Entertainment', subtext: 'No YouTube/videos while eating' },
    { key: 'movement', label: '8. Movement (5x / week)', subtext: 'Gym, cardio, running, or mobility' }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* TITLE BAR */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>DAILY ROLL CALL PROTOCOL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          DAY {personalDay} <span className="text-zinc-500 font-normal text-xl">/ {TOTAL_ARC_DAYS}</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Check off the commitments you completed today. Be honest with yourself.
        </p>
      </div>

      {submitted ? (
        /* SUBMISSION CONFIRMATION BANNER */
        <div className="glass-panel p-8 rounded-2xl border border-emerald-500/40 text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
            <Shield className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
              DAY {personalDay} ROLL CALL COMPLETE
            </div>
            <div className="text-5xl font-black text-white font-mono my-2">
              {submittedScore} / 8
            </div>

            <h2 className="text-2xl font-extrabold text-white mt-4">
              {submittedScore === 8 ? 'I SHOWED UP.' : 'I OWN IT.'}
            </h2>
            <p className="text-sm text-zinc-300 max-w-sm mx-auto mt-2">
              {submittedScore === 8
                ? 'Flawless adherence today. You won the day.'
                : 'Honesty is the foundation of discipline. Tomorrow is another battle.'}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-colors"
            >
              Go to Personal Dashboard
            </button>
            <button
              onClick={() => router.push('/community')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-sm transition-colors"
            >
              View Community Roll Call
            </button>
          </div>
        </div>
      ) : (
        /* ROLL CALL CHECKLIST FORM */
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          {/* LIVE SCORE COUNTER */}
          <div className="flex items-center justify-between p-4 bg-zinc-900/90 rounded-xl border border-zinc-800">
            <div>
              <div className="text-xs font-mono text-zinc-400">TODAY'S ADHERENCE SCORE</div>
              <div className="text-2xl font-black text-white font-mono">
                {currentScore} <span className="text-zinc-500 text-sm font-normal">/ 8 Completed</span>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-bold font-mono px-3 py-1.5 rounded-lg border ${
                  currentScore === 8
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : currentScore >= 6
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {currentScore === 8 ? 'PERFECT 8/8' : `${currentScore}/8 RULES`}
              </span>
            </div>
          </div>

          {/* CHECKBOXES */}
          <div className="space-y-3">
            {ruleDetails.map((rule) => {
              const isChecked = commitments[rule.key as keyof CommitmentsState];
              return (
                <div
                  key={rule.key}
                  onClick={() => toggleCommitment(rule.key as keyof CommitmentsState)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                      : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                      {rule.label}
                    </div>
                    <p className="text-xs text-zinc-400">{rule.subtext}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-black font-bold'
                        : 'border-zinc-700 bg-zinc-900'
                    }`}
                  >
                    {isChecked && '✓'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PRIVATE JOURNAL ENTRY */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                10-Minute Private Journal Entry
              </label>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% PRIVATE & ENCRYPTED
              </span>
            </div>
            <textarea
              rows={3}
              value={privateReflection}
              onChange={(e) => setPrivateReflection(e.target.value)}
              placeholder="Reflect on your battles, triggers, and victories today. Never shared with the community."
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* DAILY COMMUNITY QUESTION */}
          {question && (
            <div className="space-y-2 pt-4 border-t border-white/5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Daily Community Question
              </label>
              <p className="text-xs text-amber-300 italic font-medium">"{question.question}"</p>
              <textarea
                rows={2}
                value={communityAnswer}
                onChange={(e) => setCommunityAnswer(e.target.value)}
                placeholder="Answer anonymously to share your perspective with the community feed..."
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all glow-emerald disabled:opacity-50"
          >
            <span>{submitting ? 'LOGGING CHECKIN TO SUPABASE...' : `SUBMIT DAY ${personalDay} ROLL CALL (${currentScore}/8)`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
