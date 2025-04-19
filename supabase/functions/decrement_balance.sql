
CREATE OR REPLACE FUNCTION public.decrement_balance(account_id_param UUID, amount_param INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  SELECT balance INTO current_balance FROM accounts WHERE id = account_id_param;
  UPDATE accounts SET balance = current_balance - amount_param WHERE id = account_id_param;
  RETURN current_balance - amount_param;
END;
$$;
