-- RECLAIM MEN - Database Schema Migration
-- Winter Arc 2026 & Rolling Personal Arc System

-- Enable UUID extension if not enabled
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
('day_1', 'STARTED', '🧊', 1, 'Began the 92-day Winter Arc journey.'),
('day_3', 'SPARK', '🔥', 3, 'Built momentum for 3 consecutive days.'),
('day_7', 'FIRST SHIELD', '🛡️', 7, 'Completed 7 days of discipline.'),
('day_14', 'DISCIPLINE BUILDER', '⚔️', 14, 'Two full weeks of intentional focus.'),
('day_21', 'MINDSET SHIFT', '🧠', 21, '21 days — new neural pathways forming.'),
('day_30', 'IRON MONTH', '🏆', 30, 'Conquered a full month of discipline.'),
('day_45', 'UNSHAKEN', '🔥', 45, 'Halfway through the 92-day Arc.'),
('day_60', 'IRON MIND', '🗿', 60, '60 days of mastering attention and habits.'),
('day_75', 'ELITE STREAK', '⚡', 75, '75 days of unbreakable adherence.'),
('day_92', 'WINTER ARC COMPLETE', '👑', 92, 'Conquered the entire 92-Day Winter Arc!')
ON CONFLICT (id) DO NOTHING;

-- 5. USER BADGES TABLE
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 6. COMMUNITY QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.community_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    active_date DATE UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Sample Community Questions
INSERT INTO public.community_questions (question, active_date) VALUES
('What was your biggest battle today, and how did you conquer it?', CURRENT_DATE),
('What triggered your urge to doomscroll today, and what did you do instead?', CURRENT_DATE - INTERVAL '1 day'),
('What is one habit or thought pattern you are actively taking control of this week?', CURRENT_DATE - INTERVAL '2 days')
ON CONFLICT (active_date) DO NOTHING;

-- 7. COMMUNITY RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.community_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
    response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COMMUNITY FEED TABLE (Anonymous Posts/Reflections)
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

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON public.daily_checkins(user_id, date);
CREATE INDEX IF NOT EXISTS idx_profiles_public_arc_id ON public.profiles(public_arc_id);
CREATE INDEX IF NOT EXISTS idx_community_feed_created ON public.community_feed(created_at DESC);

-- ARC ID GENERATOR FUNCTION
CREATE OR REPLACE FUNCTION generate_arc_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    result TEXT := 'ARC-';
    i INT := 0;
    candidate TEXT;
    done BOOLEAN := FALSE;
BEGIN
    WHILE NOT done LOOP
        result := 'ARC-';
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END FOR;
        candidate := result;
        PERFORM 1 FROM public.profiles WHERE public_arc_id = candidate;
        IF NOT FOUND THEN
            done := TRUE;
        END IF;
    END LOOP;
    RETURN candidate;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_feed ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR PROFILES
CREATE POLICY "Public profiles can be viewed by anyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- POLICIES FOR DAILY CHECK-INS (Private reflections protected)
CREATE POLICY "Users can view their own checkins"
    ON public.daily_checkins FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkins"
    ON public.daily_checkins FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkins"
    ON public.daily_checkins FOR UPDATE
    USING (auth.uid() = user_id);

-- POLICIES FOR STREAKS
CREATE POLICY "Users can view their own streak"
    ON public.streaks FOR SELECT
    USING (auth.uid() = user_id);

-- POLICIES FOR COMMUNITY FEED (Public read, authenticated write)
CREATE POLICY "Feed is publicly readable"
    ON public.community_feed FOR SELECT
    USING (true);

CREATE POLICY "Users can insert feed posts"
    ON public.community_feed FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- POLICIES FOR COMMUNITY RESPONSES
CREATE POLICY "Community responses are readable"
    ON public.community_responses FOR SELECT
    USING (true);

CREATE POLICY "Users can insert community responses"
    ON public.community_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);
