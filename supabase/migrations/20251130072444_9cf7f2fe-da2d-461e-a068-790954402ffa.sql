-- Fix search path for user_owns_book function
ALTER FUNCTION public.user_owns_book(uuid) SET search_path = public;