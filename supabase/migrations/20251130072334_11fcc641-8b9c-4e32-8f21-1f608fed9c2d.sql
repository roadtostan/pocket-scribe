-- Update RLS policies to allow all authenticated users full access to all data

-- Books table - allow authenticated users to access all books
DROP POLICY IF EXISTS "Users can view their own books" ON public.books;
DROP POLICY IF EXISTS "Users can create their own books" ON public.books;
DROP POLICY IF EXISTS "Users can update their own books" ON public.books;
DROP POLICY IF EXISTS "Users can delete their own books" ON public.books;

CREATE POLICY "Authenticated users can view all books"
  ON public.books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create books"
  ON public.books FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update all books"
  ON public.books FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all books"
  ON public.books FOR DELETE
  TO authenticated
  USING (true);

-- Accounts table - allow authenticated users full access
DROP POLICY IF EXISTS "Users can view accounts in their books" ON public.accounts;
DROP POLICY IF EXISTS "Users can create accounts in their books" ON public.accounts;
DROP POLICY IF EXISTS "Users can update accounts in their books" ON public.accounts;
DROP POLICY IF EXISTS "Users can delete accounts in their books" ON public.accounts;

CREATE POLICY "Authenticated users can view all accounts"
  ON public.accounts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create accounts"
  ON public.accounts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update all accounts"
  ON public.accounts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all accounts"
  ON public.accounts FOR DELETE
  TO authenticated
  USING (true);

-- Members table - allow authenticated users full access
DROP POLICY IF EXISTS "Users can view members in their books" ON public.members;
DROP POLICY IF EXISTS "Users can create members in their books" ON public.members;
DROP POLICY IF EXISTS "Users can update members in their books" ON public.members;
DROP POLICY IF EXISTS "Users can delete members in their books" ON public.members;

CREATE POLICY "Authenticated users can view all members"
  ON public.members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create members"
  ON public.members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update all members"
  ON public.members FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all members"
  ON public.members FOR DELETE
  TO authenticated
  USING (true);

-- Transactions table - allow authenticated users full access
DROP POLICY IF EXISTS "Users can view transactions in their books" ON public.transactions;
DROP POLICY IF EXISTS "Users can create transactions in their books" ON public.transactions;
DROP POLICY IF EXISTS "Users can update transactions in their books" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete transactions in their books" ON public.transactions;

CREATE POLICY "Authenticated users can view all transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create transactions"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update all transactions"
  ON public.transactions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all transactions"
  ON public.transactions FOR DELETE
  TO authenticated
  USING (true);

-- Transfer transactions table - allow authenticated users full access
DROP POLICY IF EXISTS "Users can view transfer transactions in their books" ON public.transfer_transactions;
DROP POLICY IF EXISTS "Users can create transfer transactions in their books" ON public.transfer_transactions;
DROP POLICY IF EXISTS "Users can update transfer transactions in their books" ON public.transfer_transactions;
DROP POLICY IF EXISTS "Users can delete transfer transactions in their books" ON public.transfer_transactions;

CREATE POLICY "Authenticated users can view all transfer transactions"
  ON public.transfer_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create transfer transactions"
  ON public.transfer_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update all transfer transactions"
  ON public.transfer_transactions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all transfer transactions"
  ON public.transfer_transactions FOR DELETE
  TO authenticated
  USING (true);

-- Categories table policies are already set to allow all authenticated users (using true)
-- No changes needed for categories table