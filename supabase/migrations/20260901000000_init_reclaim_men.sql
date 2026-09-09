-- RECLAIM MEN - Clean Production Supabase Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/xjsbyfmssxbfuhhgkwcz/sql/new)

-- Clean up any existing mismatched tables from prior setup attempts
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.community_feed CASCADE;
DROP TABLE IF EXISTS public.daily_checkins CASCADE;
DROP TABLE IF EXISTS public.streaks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Stores all registered members)
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    public_arc_id TEXT UNIQUE NOT NULL,
    anonymous_username TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    timezone TEXT DEFAULT 'UTC',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DAILY CHECK-INS TABLE (Logs tick marks for every commitment)
CREATE TABLE public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    personal_day INT NOT NULL DEFAULT 1,
    no_porn BOOLEAN DEFAULT FALSE,
    no_masturbation BOOLEAN DEFAULT FALSE,
    no_doomscrolling BOOLEAN DEFAULT FALSE,
    wake_5am BOOLEAN DEFAULT FALSE,
    meditation BOOLEAN DEFAULT FALSE,
    journaling BOOLEAN DEFAULT FALSE,
    no_food_entertainment BOOLEAN DEFAULT FALSE,
    movement BOOLEAN DEFAULT FALSE,
    cold_shower BOOLEAN DEFAULT FALSE,
    read_10_pages BOOLEAN DEFAULT FALSE,
    no_alcohol BOOLEAN DEFAULT FALSE,
    custom_rule_name TEXT,
    custom_rule_done BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    total_active_rules INT DEFAULT 8,
    private_reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_daily_checkin UNIQUE (user_id, date)
);

-- 3. STREAKS TABLE (Tracks live unbroken streaks per member)
CREATE TABLE public.streaks (
    user_id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    best_streak INT DEFAULT 0,
    completed_days INT DEFAULT 0,
    consistency_pct NUMERIC(5, 2) DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LIVE CHAT MESSAGES TABLE (Real-time shared community chat for all members)
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    public_arc_id TEXT NOT NULL,
    anonymous_username TEXT,
    channel TEXT NOT NULL DEFAULT 'general',
    message TEXT NOT NULL,
    fire_reactions INT DEFAULT 0,
    bicep_reactions INT DEFAULT 0,
    shield_reactions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMMUNITY FEED TABLE (Anonymous roll call posts)
CREATE TABLE public.community_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    public_arc_id TEXT NOT NULL,
    personal_day INT NOT NULL,
    score INT NOT NULL,
    reflection TEXT NOT NULL,
    fire_reactions INT DEFAULT 1,
    ice_reactions INT DEFAULT 0,
    bicep_reactions INT DEFAULT 1,
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
