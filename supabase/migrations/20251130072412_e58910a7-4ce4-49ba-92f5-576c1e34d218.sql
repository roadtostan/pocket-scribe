-- Ensure RLS is explicitly enabled on all public tables
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Fix function search paths for security
ALTER FUNCTION public.decrement_balance(uuid, integer) SET search_path = public;
ALTER FUNCTION public.increment_balance(uuid, integer) SET search_path = public;