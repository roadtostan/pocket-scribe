import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

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

export type CategoryType = {
  id: string;
  bookId: string;
  name: string;
  icon: string;
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
  transactions: TransactionType[];
  categories: CategoryType[];
  accounts: AccountType[];
  members: MemberType[];
  books: BookType[];
  currentBook: BookType;
  selectedDate: Date;
  
  addTransaction: (transaction: Omit<TransactionType, 'id' | 'bookId'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<CategoryType, 'id' | 'bookId'>) => void;
  addAccount: (name: string, type: AccountType['type'], balance: number) => void;
  updateAccount: (id: string, updates: Partial<Omit<AccountType, 'id' | 'bookId'>>) => void;
  addMember: (member: Omit<MemberType, 'id' | 'bookId'>) => void;
  addBook: (name: string) => void;
  setCurrentBook: (book: BookType) => void;
  setSelectedDate: (date: Date) => void;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

interface FinanceProviderProps {
  children: React.ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [books, setBooks] = useState<BookType[]>([]);
  const [currentBook, setCurrentBook] = useState<BookType>({ id: '1', name: 'Personal Finance' });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('*');
        
        if (booksError) throw booksError;
        
        if (booksData && booksData.length > 0) {
          setBooks(booksData);
          setCurrentBook(booksData[0]);
          
          // Fetch other data for the current book
          const bookId = booksData[0].id;
          
          const [
            { data: categoriesData, error: categoriesError },
            { data: accountsData, error: accountsError },
            { data: membersData, error: membersError },
            { data: transactionsData, error: transactionsError }
          ] = await Promise.all([
            supabase.from('categories').select('*').eq('book_id', bookId),
            supabase.from('accounts').select('*').eq('book_id', bookId),
            supabase.from('members').select('*').eq('book_id', bookId),
            supabase.from('transactions').select('*').eq('book_id', bookId)
          ]);

          if (categoriesError) throw categoriesError;
          if (accountsError) throw accountsError;
          if (membersError) throw membersError;
          if (transactionsError) throw transactionsError;

          setCategories(categoriesData || []);
          setAccounts(accountsData || []);
          setMembers(membersData || []);
          setTransactions(transactionsData || []);
        } else {
          // Create default book if none exists
          const { data: newBook, error: createBookError } = await supabase
            .from('books')
            .insert({ name: 'Personal Finance' })
            .select()
            .single();
            
          if (createBookError) throw createBookError;
          
          if (newBook) {
            setBooks([newBook]);
            setCurrentBook(newBook);
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

  // Initialize default data for a new book
  const initializeDefaultData = async (bookId: string) => {
    try {
      // Create default categories
      const defaultCategories = [
        { book_id: bookId, name: 'Food', icon: 'utensils' },
        { book_id: bookId, name: 'Transportation', icon: 'car' },
        { book_id: bookId, name: 'Shopping', icon: 'shopping-cart' },
        { book_id: bookId, name: 'Housing', icon: 'home' },
        { book_id: bookId, name: 'Entertainment', icon: 'smile' },
        { book_id: bookId, name: 'Utilities', icon: 'wifi' },
        { book_id: bookId, name: 'Gifts', icon: 'gift' },
        { book_id: bookId, name: 'Health', icon: 'heart' },
        { book_id: bookId, name: 'Clothing', icon: 'shirt' },
        { book_id: bookId, name: 'Activities', icon: 'activity' },
        { book_id: bookId, name: 'Travel', icon: 'landmark' },
        { book_id: bookId, name: 'Others', icon: 'folder' },
        { book_id: bookId, name: 'Salary', icon: 'briefcase' },
        { book_id: bookId, name: 'Investment', icon: 'trending-up' },
        { book_id: bookId, name: 'Bonus', icon: 'award' }
      ];

      const { data: categoriesData } = await supabase
        .from('categories')
        .insert(defaultCategories)
        .select();

      if (categoriesData) setCategories(categoriesData);

      // Create default accounts
      const defaultAccounts = [
        { book_id: bookId, name: 'Cash', type: 'Cash', balance: 0 },
        { book_id: bookId, name: 'Bank', type: 'Bank', balance: 0 }
      ];

      const { data: accountsData } = await supabase
        .from('accounts')
        .insert(defaultAccounts)
        .select();

      if (accountsData) setAccounts(accountsData);

      // Create default member
      const { data: memberData } = await supabase
        .from('members')
        .insert({ book_id: bookId, name: 'John Doe' })
        .select()
        .single();

      if (memberData) setMembers([memberData]);

    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  };

  // Update functions to use Supabase
  const addTransaction = async (transaction: Omit<TransactionType, 'id' | 'bookId'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...transaction, book_id: currentBook.id })
        .select()
        .single();

      if (error) throw error;
      if (data) setTransactions([...transactions, data]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const addCategory = async (category: Omit<CategoryType, 'id' | 'bookId'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ ...category, book_id: currentBook.id })
        .select()
        .single();

      if (error) throw error;
      if (data) setCategories([...categories, data]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const addAccount = async (name: string, type: AccountType['type'], balance: number) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert({ name, type, balance, book_id: currentBook.id })
        .select()
        .single();

      if (error) throw error;
      if (data) setAccounts([...accounts, data]);
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
        .insert({ ...member, book_id: currentBook.id })
        .select()
        .single();

      if (error) throw error;
      if (data) setMembers([...members, data]);
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
    setCurrentBook,
    setSelectedDate,
  };

  if (loading) {
    return <div>Loading...</div>;
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
