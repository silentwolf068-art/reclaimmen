import React from 'react';
import { BookOpen, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export default function RulesPage() {
  const rules = [
    {
      num: '01',
      name: 'NO PORNOGRAPHY',
      target: 'Zero explicit digital stimulation',
      why: 'Pornography hyper-stimulates dopamine receptors, weakening willpower, distorting real-world intimacy, and reducing motivation. Eliminating it allows your brain to reset its baseline sensitivity to normal, healthy rewards.',
      guidelines: 'Do not seek, view, or consume explicit content in any medium.'
    },
    {
      num: '02',
      name: 'NO MASTURBATION',
      target: 'Absolute sexual self-control',
      why: 'Compulsive masturbation wastes sexual energy and reinforces quick-fix dopamine seeking. Conserving this energy converts sexual tension into physical drive, focus, and mental sharpness.',
      guidelines: 'Practice complete self-restraint. Sexual energy is redirected toward creation and discipline.'
    },
    {
      num: '03',
      name: 'NO DOOM SCROLLING',
      target: 'Eliminate infinite short-form feeds',
      why: 'Instagram Reels, TikTok, YouTube Shorts, and endless newsfeeds train your brain to have an ultra-short attention span and constant need for novelty.',
      guidelines: 'Intentional technology use is permitted (work, learning, direct messaging). Infinite feed scrolling is strictly prohibited.'
    },
    {
      num: '04',
      name: 'WAKE UP AT 5:00 AM',
      target: 'Conquer the early morning',
      why: 'Waking early builds discipline before the world creates noise and demands your attention. It creates 2-3 hours of uninterrupted focus every single day.',
      guidelines: 'Target 5:00 AM wake up in your local timezone. Get out of bed immediately upon waking.'
    },
    {
      num: '05',
      name: '10 MINUTES MEDITATION',
      target: 'Daily mental stilling',
      why: 'Meditation strengthens the prefrontal cortex — the brain area responsible for impulse control, emotional regulation, and deep concentration.',
      guidelines: '10 continuous minutes of silent breath meditation or mindfulness daily.'
    },
    {
      num: '06',
      name: '10 MINUTES JOURNALING',
      target: 'End-of-day self-reflection',
      why: 'Writing down your thoughts, battles, and accomplishments externalizes mental clutter and holds you accountable to yourself.',
      guidelines: 'Write for at least 10 minutes at night. Your journal content is 100% private and never exposed to the community.'
    },
    {
      num: '07',
      name: 'EAT WITHOUT ENTERTAINMENT',
      target: 'Dopamine detox during meals',
      why: 'Eating while watching videos or movies combines two powerful reward signals (food + video), creating deep habit loops of constant overstimulation.',
      guidelines: 'Eat meals in quiet presence. Focus on your food, conversation, or quiet thought.'
    },
    {
      num: '08',
      name: 'MOVEMENT 5X / WEEK',
      target: 'Physical hardiness',
      why: 'A strong mind requires a resilient physical vessel. Exercise releases endorphins, improves sleep architecture, and reduces stress hormones.',
      guidelines: 'At least 5 days per week. Acceptable: Gym, cardio, running, walking, mobility, or sports.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>THE DISCIPLINE PROTOCOL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">THE 8 DAILY COMMITMENTS</h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Detailed standards and guidelines for the 92-day Winter Arc challenge.
        </p>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.num} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                RULE {rule.num}
              </span>
              <span className="text-xs font-mono text-zinc-400">{rule.target}</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">{rule.name}</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">{rule.why}</p>
            <div className="pt-3 border-t border-white/5 text-xs text-zinc-400 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Standard: {rule.guidelines}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
