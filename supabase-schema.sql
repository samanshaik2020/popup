-- Complete Supabase Schema for Popup Link Application
-- Project ID: qaoyenwrsmevxumibosq

-- PART 1: USER MANAGEMENT

-- Create user_profiles table to store additional user information
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- PART 2: POPUP LINKS MANAGEMENT

-- Create or modify links table to store popup links
DO $$
BEGIN
  -- Create links table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'links') THEN
    CREATE TABLE public.links (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      short_code TEXT UNIQUE NOT NULL,
      original_url TEXT NOT NULL, -- Destination URL (required)
      content JSONB, -- Store all ad settings as JSON
      views INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Enable RLS on the new table
    ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
    
    -- Create policies for the new table
    CREATE POLICY "Users can view their own links" 
      ON public.links FOR SELECT 
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can create their own links" 
      ON public.links FOR INSERT 
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own links" 
      ON public.links FOR UPDATE 
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own links" 
      ON public.links FOR DELETE 
      USING (auth.uid() = user_id);
      
  -- If table exists but content column doesn't, add it
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'links' 
                   AND column_name = 'content') THEN
    ALTER TABLE public.links ADD COLUMN content JSONB;
  END IF;
END
$$;

-- PART 3: ANALYTICS TRACKING

-- Create link_analytics table to track link clicks and views
CREATE TABLE IF NOT EXISTS public.link_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES public.links(id) NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  is_click BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on analytics table
ALTER TABLE public.link_analytics ENABLE ROW LEVEL SECURITY;

-- Create analytics policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'link_analytics' AND policyname = 'Users can view analytics for their own links') THEN
    CREATE POLICY "Users can view analytics for their own links" 
      ON public.link_analytics FOR SELECT 
      USING (EXISTS (
        SELECT 1 FROM public.links 
        WHERE links.id = link_analytics.link_id 
        AND links.user_id = auth.uid()
      ));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'link_analytics' AND policyname = 'Public can create analytics entries') THEN
    CREATE POLICY "Public can create analytics entries" 
      ON public.link_analytics FOR INSERT 
      WITH CHECK (true);
  END IF;
END
$$;

-- PART 4: PERFORMANCE OPTIMIZATIONS

-- Create indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS links_user_id_idx ON public.links (user_id);
CREATE INDEX IF NOT EXISTS links_short_code_idx ON public.links (short_code);
CREATE INDEX IF NOT EXISTS link_analytics_link_id_idx ON public.link_analytics (link_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at') THEN
    CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_links_updated_at') THEN
    CREATE TRIGGER update_links_updated_at
    BEFORE UPDATE ON public.links
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END
$$;
