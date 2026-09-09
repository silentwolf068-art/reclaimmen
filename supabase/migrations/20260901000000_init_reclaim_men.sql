-- RECLAIM MEN - Database Schema Migration
-- Winter Arc 2026 & Rolling Personal Arc System

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    public_arc_id VARCHAR(12) UNIQUE NOT NULL,
    anonymous_username TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    timezone TEXT DEFAULT 'UTC',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DAILY CHECK-INS TABLE
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    personal_day INT NOT NULL CHECK (personal_day BETWEEN 1 AND 108),
    no_porn BOOLEAN NOT NULL DEFAULT FALSE,
    no_masturbation BOOLEAN NOT NULL DEFAULT FALSE,
    no_doomscrolling BOOLEAN NOT NULL DEFAULT FALSE,
    wake_5am BOOLEAN NOT NULL DEFAULT FALSE,
    meditation BOOLEAN NOT NULL DEFAULT FALSE,
    journaling BOOLEAN NOT NULL DEFAULT FALSE,
    no_food_entertainment BOOLEAN NOT NULL DEFAULT FALSE,
    movement BOOLEAN NOT NULL DEFAULT FALSE,
    cold_shower BOOLEAN DEFAULT FALSE,
    read_10_pages BOOLEAN DEFAULT FALSE,
    no_alcohol BOOLEAN DEFAULT FALSE,
    custom_rule_name TEXT,
    custom_rule_done BOOLEAN DEFAULT FALSE,
    score INT NOT NULL DEFAULT 0,
    total_active_rules INT DEFAULT 8,
    private_reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 3. STREAKS TABLE
CREATE TABLE IF NOT EXISTS public.streaks (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    best_streak INT NOT NULL DEFAULT 0,
    completed_days INT NOT NULL DEFAULT 0,
    consistency_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BADGES MASTER TABLE
CREATE TABLE IF NOT EXISTS public.badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    threshold INT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Milestones
INSERT INTO public.badges (id, name, icon, threshold, description) VALUES
('day_1', 'STARTED', '🧊', 1, 'Began the 108-day Winter Arc journey.'),
('day_3', 'SPARK', '🔥', 3, 'Built momentum for 3 consecutive days.'),
('day_7', 'FIRST SHIELD', '🛡️', 7, 'Completed 7 days of discipline.'),
('day_14', 'DISCIPLINE BUILDER', '⚔️', 14, 'Two full weeks of intentional focus.'),
('day_21', 'MINDSET SHIFT', '🧠', 21, '21 days — new neural pathways forming.'),
('day_30', 'IRON MONTH', '🏆', 30, 'Conquered a full month of discipline.'),
('day_45', 'UNSHAKEN', '🔥', 45, 'Halfway through the Winter Arc.'),
('day_60', 'IRON MIND', '🗿', 60, '60 days of mastering attention and habits.'),
('day_75', 'ELITE STREAK', '⚡', 75, '75 days of unbreakable adherence.'),
('day_108', 'WINTER ARC COMPLETE', '👑', 108, 'Conquered the entire 108-Day Winter Arc!')
ON CONFLICT (id) DO NOTHING;

-- 5. USER BADGES TABLE
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 6. LIVE CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    public_arc_id VARCHAR(12) NOT NULL,
    anonymous_username TEXT,
    channel TEXT NOT NULL DEFAULT 'general',
    message TEXT NOT NULL,
    fire_reactions INT DEFAULT 0,
    bicep_reactions INT DEFAULT 0,
    shield_reactions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMMUNITY FEED TABLE
CREATE TABLE IF NOT EXISTS public.community_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    personal_day INT NOT NULL,
    score INT NOT NULL,
    reflection TEXT NOT NULL,
    fire_reactions INT DEFAULT 0,
    ice_reactions INT DEFAULT 0,
    bicep_reactions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS & INDEXES
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON public.chat_messages(channel, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON public.daily_checkins(user_id, date);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles can be viewed" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update self profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users view own checkins" ON public.daily_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own checkins" ON public.daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Chat messages readable" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users insert chat messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
