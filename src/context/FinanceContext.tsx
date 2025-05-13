import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export type TransactionType = {
  id: string;
  bookId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  accountId: string;
  memberId: string;
  date: string;
  description: string;
};

export type TransferTransactionType = {
  id: string;
  bookId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  description: string;
  memberId: string;
  type: 'transfer';
};

export type CategoryType = {
  id: string;
  name: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
};

export type AccountType = {
  id: string;
  bookId: string;
  name: string;
  type: 'Cash' | 'Bank' | 'Credit Card' | 'Investment' | 'Debt' | 'Conventional Bank' | 'Digital Bank' | 'Ewallet';
  balance: number;
};

export type MemberType = {
  id: string;
  bookId: string;
  name: string;
};

type BookType = {
  id: string;
  name: string;
};

type FinanceContextType = {
  transactions: (TransactionType | TransferTransactionType)[];
  categories: CategoryType[];
  accounts: AccountType[];
  members: MemberType[];
  books: BookType[];
  currentBook: BookType;
  selectedDate: Date;
  
  addTransaction: (transaction: Omit<TransactionType, 'id' | 'bookId'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<CategoryType, 'id'>) => void;
  addAccount: (name: string, type: AccountType['type'], balance: number) => void;
  updateAccount: (id: string, updates: Partial<Omit<AccountType, 'id' | 'bookId'>>) => void;
  addMember: (member: Omit<MemberType, 'id' | 'bookId'>) => void;
  addBook: (name: string) => void;
  setCurrentBook: (book: BookType) => void;
  setSelectedDate: (date: Date) => void;
  fetchTransactionsForBook: (bookId: string) => void;
  fetchCategoriesForBook: (bookId: string) => void;
  fetchAccountsForBook: (bookId: string) => void;
  fetchMembersForBook: (bookId: string) => void;
  addTransferTransaction: (transfer: Omit<TransferTransactionType, 'id' | 'bookId'>) => void;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

interface FinanceProviderProps {
  children: React.ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<(TransactionType | TransferTransactionType)[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [books, setBooks] = useState<BookType[]>([]);
  const [currentBook, setCurrentBook] = useState<BookType>({ id: '1', name: 'Personal Finance' });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('*');
        
        if (booksError) throw booksError;
        
        if (booksData && booksData.length > 0) {
          const mappedBooks = booksData.map(book => ({
            id: book.id,
            name: book.name
          }));
          
          setBooks(mappedBooks);
          setCurrentBook(mappedBooks[0]);
          
          const bookId = mappedBooks[0].id;
          
          await Promise.all([
            fetchCategoriesForBook(bookId),
            fetchAccountsForBook(bookId),
            fetchMembersForBook(bookId),
            fetchTransactionsForBook(bookId)
          ]);
        } else {
          const { data: newBook, error: createBookError } = await supabase
            .from('books')
            .insert({ name: 'Personal Finance' })
            .select()
            .single();
            
          if (createBookError) throw createBookError;
          
          if (newBook) {
            const mappedBook = { id: newBook.id, name: newBook.name };
            setBooks([mappedBook]);
            setCurrentBook(mappedBook);
            await initializeDefaultData(newBook.id);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTransactionsForBook = useCallback(async (bookId: string) => {
    try {
      // Fetch regular transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('book_id', bookId);

      if (transactionsError) throw transactionsError;

      // Fetch transfer transactions
      const { data: transferData, error: transferError } = await supabase
        .from('transfer_transactions')
        .select('*')
        .eq('book_id', bookId);

      if (transferError) throw transferError;

      const regularTransactions = transactionsData?.map(transaction => ({
        id: transaction.id,
        bookId: transaction.book_id,
        amount: transaction.amount,
        type: transaction.type as 'income' | 'expense',
        categoryId: transaction.category_id,
        accountId: transaction.account_id,
        memberId: transaction.member_id,
        date: transaction.date,
        description: transaction.description || ''
      })) || [];

      const transferTransactions = transferData?.map(transfer => ({
        id: transfer.id,
        bookId: transfer.book_id,
        amount: transfer.amount,
        type: 'transfer' as const,
        fromAccountId: transfer.from_account_id,
        toAccountId: transfer.to_account_id,
        memberId: transfer.member_id,
        date: transfer.date,
        description: transfer.description || ''
      })) || [];

      setTransactions([...regularTransactions, ...transferTransactions]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  const fetchCategoriesForBook = useCallback(async (bookId: string) => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;

      setCategories(categoriesData?.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
        type: category.type as 'income' | 'expense' | 'both'
      })) || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchAccountsForBook = useCallback(async (bookId: string) => {
    try {
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('book_id', bookId);

      if (accountsError) throw accountsError;

      setAccounts(accountsData?.map(account => ({
        id: account.id,
        bookId: account.book_id,
        name: account.name,
        type: account.type as AccountType['type'],
        balance: account.balance
      })) || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  }, []);

  const fetchMembersForBook = useCallback(async (bookId: string) => {
    try {
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('book_id', bookId);

      if (membersError) throw membersError;

      setMembers(membersData?.map(member => ({
        id: member.id,
        bookId: member.book_id,
        name: member.name
      })) || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }, []);

  const initializeDefaultData = async (bookId: string) => {
    try {
      const defaultCategories = [
        { name: 'Food', icon: 'utensils', type: 'expense' },
        { name: 'Transportation', icon: 'car', type: 'expense' },
        { name: 'Shopping', icon: 'shopping-cart', type: 'expense' },
        { name: 'Housing', icon: 'home', type: 'expense' },
        { name: 'Entertainment', icon: 'smile', type: 'expense' },
        { name: 'Utilities', icon: 'wifi', type: 'expense' },
        { name: 'Gifts', icon: 'gift', type: 'expense' },
        { name: 'Health', icon: 'heart', type: 'expense' },
        { name: 'Clothing', icon: 'shirt', type: 'expense' },
        { name: 'Activities', icon: 'activity', type: 'expense' },
        { name: 'Travel', icon: 'landmark', type: 'expense' },
        { name: 'Others', icon: 'folder', type: 'expense' },
        { name: 'Salary', icon: 'briefcase', type: 'income' },
        { name: 'Investment', icon: 'trending-up', type: 'income' },
        { name: 'Bonus', icon: 'award', type: 'income' }
      ];

      const { data: categoriesData } = await supabase
        .from('categories')
        .insert(defaultCategories)
        .select();

      if (categoriesData) {
        setCategories(categoriesData.map(category => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
          type: category.type as 'income' | 'expense' | 'both'
        })));
      }

      const defaultAccounts = [
        { book_id: bookId, name: 'Uang tunai', type: 'Cash', balance: 0 },
        { book_id: bookId, name: 'Bank', type: 'Conventional Bank', balance: 0 }
      ];

      const { data: accountsData } = await supabase
        .from('accounts')
        .insert(defaultAccounts)
        .select();

      if (accountsData) {
        setAccounts(accountsData.map(account => ({
          id: account.id,
          bookId: account.book_id,
          name: account.name,
          type: account.type as AccountType['type'],
          balance: account.balance
        })));
      }

      const { data: memberData } = await supabase
        .from('members')
        .insert({ book_id: bookId, name: 'Saya' })
        .select()
        .single();

      if (memberData) {
        setMembers([{
          id: memberData.id,
          bookId: memberData.book_id,
          name: memberData.name
        }]);
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  };

  const setCurrentBookWithDataRefresh = async (book: BookType) => {
    setCurrentBook(book);
    await Promise.all([
      fetchTransactionsForBook(book.id),
      fetchCategoriesForBook(book.id),
      fetchAccountsForBook(book.id),
      fetchMembersForBook(book.id)
    ]);
  };

  const addTransaction = async (transaction: Omit<TransactionType, 'id' | 'bookId'>) => {
    try {
      if (transaction.type === 'income') {
        const { data: newBalance, error: accountError } = await supabase.rpc(
          'increment_balance', 
          { 
            account_id_param: transaction.accountId, 
            amount_param: transaction.amount 
          }
        );

        if (accountError) throw accountError;

        const { error: updateError } = await supabase
          .from('accounts')
          .update({ balance: newBalance })
          .eq('id', transaction.accountId);

        if (updateError) throw updateError;
      } else {
        const { data: newBalance, error: accountError } = await supabase.rpc(
          'decrement_balance', 
          { 
            account_id_param: transaction.accountId, 
            amount_param: transaction.amount 
          }
        );

        if (accountError) throw accountError;

        const { error: updateError } = await supabase
          .from('accounts')
          .update({ balance: newBalance })
          .eq('id', transaction.accountId);

        if (updateError) throw updateError;
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          book_id: currentBook.id,
          amount: transaction.amount,
          type: transaction.type,
          category_id: transaction.categoryId,
          account_id: transaction.accountId,
          member_id: transaction.memberId,
          date: transaction.date,
          description: transaction.description
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTransactions([...transactions, {
          id: data.id,
          bookId: data.book_id,
          amount: data.amount,
          type: data.type as 'income' | 'expense',
          categoryId: data.category_id,
          accountId: data.account_id,
          memberId: data.member_id,
          date: data.date,
          description: data.description || ''
        }]);

        await fetchAccountsForBook(currentBook.id);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const addTransferTransaction = async (transfer: Omit<TransferTransactionType, 'id' | 'bookId'>) => {
    try {
      const { data: fromAccountBalance, error: fromAccountError } = await supabase.rpc(
        'decrement_balance', 
        { 
          account_id_param: transfer.fromAccountId, 
          amount_param: transfer.amount 
        }
      );

      if (fromAccountError) throw fromAccountError;

      const { error: updateFromError } = await supabase
        .from('accounts')
        .update({ balance: fromAccountBalance })
        .eq('id', transfer.fromAccountId);

      if (updateFromError) throw updateFromError;

      const { data: toAccountBalance, error: toAccountError } = await supabase.rpc(
        'increment_balance', 
        { 
          account_id_param: transfer.toAccountId, 
          amount_param: transfer.amount 
        }
      );

      if (toAccountError) throw toAccountError;

      const { error: updateToError } = await supabase
        .from('accounts')
        .update({ balance: toAccountBalance })
        .eq('id', transfer.toAccountId);

      if (updateToError) throw updateToError;

      const { data, error } = await supabase
        .from('transfer_transactions')
        .insert({
          book_id: currentBook.id,
          from_account_id: transfer.fromAccountId,
          to_account_id: transfer.toAccountId,
          amount: transfer.amount,
          date: transfer.date,
          description: transfer.description,
          member_id: transfer.memberId
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTransactions([...transactions, {
          id: data.id,
          bookId: data.book_id,
          amount: data.amount,
          type: 'transfer' as const,
          fromAccountId: data.from_account_id,
          toAccountId: data.to_account_id,
          memberId: data.member_id,
          date: data.date,
          description: data.description || ''
        }]);

        await fetchAccountsForBook(currentBook.id);
      }
    } catch (error) {
      console.error('Error adding transfer:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      // First, check if it's a regular transaction
      const transaction = transactions.find(t => t.id === id);
      if (!transaction) return;

      if ('type' in transaction && (transaction.type === 'income' || transaction.type === 'expense')) {
        // Get the account's current balance
        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .select('balance')
          .eq('id', transaction.accountId)
          .single();

        if (accountError) throw accountError;

        // Calculate the new balance
        const newBalance = transaction.type === 'income' 
          ? accountData.balance - transaction.amount  // Reverse income
          : accountData.balance + transaction.amount; // Reverse expense

        // Update the account balance
        const { error: updateError } = await supabase
          .from('accounts')
          .update({ balance: newBalance })
          .eq('id', transaction.accountId);

        if (updateError) throw updateError;

        // Delete the transaction
        const { error: deleteError } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
      } else {
        // It's a transfer transaction
        const transfer = transaction as TransferTransactionType;
        
        // Reverse the transfer by updating both accounts
        const { error: fromAccountError } = await supabase.rpc(
          'increment_balance',
          {
            account_id_param: transfer.fromAccountId,
            amount_param: transfer.amount
          }
        );

        if (fromAccountError) throw fromAccountError;

        const { error: toAccountError } = await supabase.rpc(
          'decrement_balance',
          {
            account_id_param: transfer.toAccountId,
            amount_param: transfer.amount
          }
        );

        if (toAccountError) throw toAccountError;

        // Delete the transfer transaction
        const { error: deleteError } = await supabase
          .from('transfer_transactions')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
      }

      // Update local state
      setTransactions(transactions.filter(t => t.id !== id));
      await fetchAccountsForBook(currentBook.id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const addCategory = async (category: Omit<CategoryType, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          icon: category.icon,
          type: category.type
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCategories([...categories, {
          id: data.id,
          name: data.name,
          icon: data.icon,
          type: data.type as 'income' | 'expense' | 'both'
        }]);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const addAccount = async (name: string, type: AccountType['type'], balance: number) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert({
          book_id: currentBook.id,
          name,
          type,
          balance
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setAccounts([...accounts, {
          id: data.id,
          bookId: data.book_id,
          name: data.name,
          type: data.type as AccountType['type'],
          balance: data.balance
        }]);
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const updateAccount = async (id: string, updates: Partial<Omit<AccountType, 'id' | 'bookId'>>) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setAccounts(accounts.map(account => 
          account.id === id ? { ...account, ...updates } : account
        ));
      }
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const addMember = async (member: Omit<MemberType, 'id' | 'bookId'>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert({
          book_id: currentBook.id,
          name: member.name
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setMembers([...members, {
          id: data.id,
          bookId: data.book_id,
          name: data.name
        }]);
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const addBook = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setBooks([...books, data]);
        setCurrentBook(data);
        await initializeDefaultData(data.id);
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const value = {
    transactions,
    categories,
    accounts,
    members,
    books,
    currentBook,
    selectedDate,
    addTransaction,
    deleteTransaction,
    addCategory,
    addAccount,
    updateAccount,
    addMember,
    addBook,
    setCurrentBook: setCurrentBookWithDataRefresh,
    setSelectedDate,
    fetchTransactionsForBook,
    fetchCategoriesForBook,
    fetchAccountsForBook,
    fetchMembersForBook,
    addTransferTransaction,
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
