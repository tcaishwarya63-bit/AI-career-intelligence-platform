-- ========================================================
-- CareerCast / AI Career Intelligence Platform Database Schema
-- Matches the schema specification on Page 8 of the Project Document
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    skills TEXT[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 0,
    education_level TEXT,
    institution TEXT,
    target_role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create RESUMES Table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    extracted_skills TEXT[] DEFAULT '{}',
    extracted_roles TEXT[] DEFAULT '{}',
    extracted_degrees TEXT[] DEFAULT '{}',
    upload_date TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create PREDICTIONS Table
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    predicted_role TEXT NOT NULL,
    confidence_score NUMERIC(5,2),
    all_probabilities JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) on all tables for Privacy & Data Isolation
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies (Students can only view & modify their own data)
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert/update their own profile" 
    ON public.profiles FOR ALL 
    USING (auth.uid() = id);

CREATE POLICY "Users can manage their own resumes" 
    ON public.resumes FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own predictions" 
    ON public.predictions FOR ALL 
    USING (auth.uid() = user_id);

-- 6. Trigger to automatically create a profile when a new user registers in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'full_name', 'Student Explorer'),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
