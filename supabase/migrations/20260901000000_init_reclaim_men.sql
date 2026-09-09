-- RECLAIM MEN - Fully Integrated Production Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/xjsbyfmssxbfuhhgkwcz/sql/new)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Stores all registered members)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    public_arc_id VARCHAR(12) UNIQUE NOT NULL,
    anonymous_username TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    timezone TEXT DEFAULT 'UTC',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DAILY CHECK-INS TABLE (Logs tick marks for every commitment)
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    personal_day INT NOT NULL,
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

-- 3. STREAKS TABLE (Tracks live unbroken streaks per member)
CREATE TABLE IF NOT EXISTS public.streaks (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    best_streak INT NOT NULL DEFAULT 0,
    completed_days INT NOT NULL DEFAULT 0,
    consistency_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LIVE CHAT MESSAGES TABLE (Real-time shared community chat for all members)
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

-- 5. COMMUNITY FEED TABLE (Anonymous roll call posts)
CREATE TABLE IF NOT EXISTS public.community_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    public_arc_id VARCHAR(12) NOT NULL,
    personal_day INT NOT NULL,
    score INT NOT NULL,
    reflection TEXT NOT NULL,
    fire_reactions INT DEFAULT 0,
    ice_reactions INT DEFAULT 0,
    bicep_reactions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DISABLE STRICT RLS OR ADD PUBLIC PERMISSIVE POLICIES FOR FULL DB INTEGRATION
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_feed DISABLE ROW LEVEL SECURITY;

-- INDEXES FOR FAST GLOBAL QUERIES
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON public.daily_checkins(date);
CREATE INDEX IF NOT EXISTS idx_chat_channel ON public.chat_messages(channel, created_at DESC);
