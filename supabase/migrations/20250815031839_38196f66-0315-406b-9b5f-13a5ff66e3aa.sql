-- First, add user_id to books table to establish ownership
ALTER TABLE public.books ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing books to have a user_id (this will need to be handled manually in production)
-- For now, we'll make it nullable but in production you'd want to assign proper ownership

-- Drop all existing overly permissive RLS policies
DROP POLICY IF EXISTS "Allow all operations on books" ON public.books;
DROP POLICY IF EXISTS "Allow all operations on accounts" ON public.accounts;
DROP POLICY IF EXISTS "Allow all operations on transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow all operations on transfer transactions" ON public.transfer_transactions;
DROP POLICY IF EXISTS "Allow all operations on members" ON public.members;
DROP POLICY IF EXISTS "Allow all operations on categories" ON public.categories;

-- Create secure RLS policies for books table
CREATE POLICY "Users can view their own books" 
ON public.books 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own books" 
ON public.books 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books" 
ON public.books 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books" 
ON public.books 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create a security definer function to check book ownership
CREATE OR REPLACE FUNCTION public.user_owns_book(book_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id_param AND user_id = auth.uid()
  );
$$;

-- Create secure RLS policies for accounts table
CREATE POLICY "Users can view accounts in their books" 
ON public.accounts 
FOR SELECT 
USING (public.user_owns_book(book_id));

CREATE POLICY "Users can create accounts in their books" 
ON public.accounts 
FOR INSERT 
WITH CHECK (public.user_owns_book(book_id));

CREATE POLICY "Users can update accounts in their books" 
ON public.accounts 
FOR UPDATE 
USING (public.user_owns_book(book_id));

CREATE POLICY "Users can delete accounts in their books" 
ON public.accounts 
FOR DELETE 
USING (public.user_owns_book(book_id));

-- Create secure RLS policies for transactions table
CREATE POLICY "Users can view transactions in their books" 
ON public.transactions 
FOR SELECT 
USING (public.user_owns_book(book_id));

CREATE POLICY "Users can create transactions in their books" 
ON public.transactions 
FOR INSERT 
WITH CHECK (public.user_owns_book(book_id));

CREATE POLICY "Users can update transactions in their books" 
ON public.transactions 
FOR UPDATE 
USING (public.user_owns_book(book_id));

CREATE POLICY "Users can delete transactions in their books" 
ON public.transactions 
FOR DELETE 
USING (public.user_owns_book(book_id));

-- Create secure RLS policies for transfer_transactions table
CREATE POLICY "Users can view transfer transactions in their books" 
ON public.transfer_transactions 
FOR SELECT 
USING (public.user_owns_book(book_id));

CREATE POLICY "Users can create transfer transactions in their books" 
ON public.transfer_transactions 
FOR INSERT 
WITH CHECK (public.user_owns_book(book_id));

CREATE POLICY "Users can update transfer transactions in their books" 
ON public.transfer_transactions 
FOR UPDATE 
USING (public.user_owns_book(book_id));

CREATE POLICY "Users can delete transfer transactions in their books" 
ON public.transfer_transactions 
FOR DELETE 
USING (public.user_owns_book(book_id));

-- Create secure RLS policies for members table
CREATE POLICY "Users can view members in their books" 
ON public.members 
FOR SELECT 
USING (public.user_owns_book(book_id));

CREATE POLICY "Users can create members in their books" 
ON public.members 
FOR INSERT 
WITH CHECK (public.user_owns_book(book_id));

CREATE POLICY "Users can update members in their books" 
ON public.members 
FOR UPDATE 
USING (public.user_owns_book(book_id));

CREATE POLICY "Users can delete members in their books" 
ON public.members 
FOR DELETE 
USING (public.user_owns_book(book_id));

-- Create secure RLS policies for categories table (global but only for authenticated users)
CREATE POLICY "Authenticated users can view categories" 
ON public.categories 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create categories" 
ON public.categories 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" 
ON public.categories 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete categories" 
ON public.categories 
FOR DELETE 
TO authenticated
USING (true);