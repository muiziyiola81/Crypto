-- ==============================================================================
-- CRYPTOLOCKER DATABASE SCHEMA & ROW LEVEL SECURITY POLICIES
-- Run this in your Supabase SQL Editor (SQL Query tab)
-- ==============================================================================

-- 1. Create the crypto_records table
CREATE TABLE IF NOT EXISTS public.crypto_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    
    -- 14 Required Crypto Fields:
    wallet_name TEXT NOT NULL,
    exchange_or_wallet_provider TEXT NOT NULL,
    record_type TEXT NOT NULL,
    username_or_email TEXT,
    wallet_password TEXT,
    pin TEXT,
    seed_phrase TEXT,
    recovery_codes TEXT,
    two_factor_codes TEXT,
    private_key TEXT,
    wallet_address TEXT,
    crypto_network TEXT NOT NULL,
    website_url TEXT,
    notes TEXT,
    
    -- Metadata Timestamps:
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_crypto_records_user_id ON public.crypto_records(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_records_created_at ON public.crypto_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crypto_records_network ON public.crypto_records(crypto_network);
CREATE INDEX IF NOT EXISTS idx_crypto_records_type ON public.crypto_records(record_type);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.crypto_records ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (Users can ONLY access and modify their own records)

-- Drop any previous policies if re-running
DROP POLICY IF EXISTS "Users can view their own crypto records" ON public.crypto_records;
DROP POLICY IF EXISTS "Users can create their own crypto records" ON public.crypto_records;
DROP POLICY IF EXISTS "Users can update their own crypto records" ON public.crypto_records;
DROP POLICY IF EXISTS "Users can delete their own crypto records" ON public.crypto_records;
DROP POLICY IF EXISTS "Admin can view all records" ON public.crypto_records;
DROP POLICY IF EXISTS "Admin can delete records" ON public.crypto_records;

-- SELECT Policy: Users can view own records (and Admin UUID if configured in Supabase)
CREATE POLICY "Users can view their own crypto records"
    ON public.crypto_records
    FOR SELECT
    USING (
        auth.uid() = user_id
    );

-- INSERT Policy: Users can create their own records
CREATE POLICY "Users can create their own crypto records"
    ON public.crypto_records
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- UPDATE Policy: Users can update their own records
CREATE POLICY "Users can update their own crypto records"
    ON public.crypto_records
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE Policy: Users can delete their own records
CREATE POLICY "Users can delete their own crypto records"
    ON public.crypto_records
    FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_timestamp ON public.crypto_records;
CREATE TRIGGER trigger_set_timestamp
    BEFORE UPDATE ON public.crypto_records
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- OPTIONAL: DIRECT DATABASE ADMIN ACCESS BY UUID
-- To grant direct database SELECT/DELETE to your admin account in Supabase,
-- uncomment and execute the following with your admin user UUID:
--
-- CREATE POLICY "Admin can view all records"
--     ON public.crypto_records FOR SELECT
--     USING (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UUID'::uuid);
--
-- CREATE POLICY "Admin can delete records"
--     ON public.crypto_records FOR DELETE
--     USING (auth.uid() = 'REPLACE_WITH_YOUR_ADMIN_UUID'::uuid);
-- ==============================================================================
