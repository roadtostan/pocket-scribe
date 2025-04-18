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

          setCategories(categoriesData?.map(category => ({
            id: category.id,
            bookId: category.book_id,
            name: category.name,
            icon: category.icon
          })) || []);

          setAccounts(accountsData?.map(account => ({
            id: account.id,
            bookId: account.book_id,
            name: account.name,
            type: account.type as AccountType['type'],
            balance: account.balance
          })) || []);

          setMembers(membersData?.map(member => ({
            id: member.id,
            bookId: member.book_id,
            name: member.name
          })) || []);

          setTransactions(transactionsData?.map(transaction => ({
            id: transaction.id,
            bookId: transaction.book_id,
            amount: transaction.amount,
            type: transaction.type as 'income' | 'expense',
            categoryId: transaction.category_id,
            accountId: transaction.account_id,
            memberId: transaction.member_id,
            date: transaction.date,
            description: transaction.description || ''
          })) || []);
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

  const initializeDefaultData = async (bookId: string) => {
    try {
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

      if (categoriesData) {
        setCategories(categoriesData.map(category => ({
          id: category.id,
          bookId: category.book_id,
          name: category.name,
          icon: category.icon
        })));
      }

      const defaultAccounts = [
        { book_id: bookId, name: 'Cash', type: 'Cash', balance: 0 },
        { book_id: bookId, name: 'Bank', type: 'Bank', balance: 0 }
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
        .insert({ book_id: bookId, name: 'John Doe' })
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

  const addTransaction = async (transaction: Omit<TransactionType, 'id' | 'bookId'>) => {
    try {
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
      }
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
        .insert({
          book_id: currentBook.id,
          name: category.name,
          icon: category.icon
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCategories([...categories, {
          id: data.id,
          bookId: data.book_id,
          name: data.name,
          icon: data.icon
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
