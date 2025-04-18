
import React, { createContext, useState, useContext, useEffect } from 'react';
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
  const [transactions, setTransactions] = useState<TransactionType[]>(() => {
    const storedTransactions = localStorage.getItem('transactions')
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  });
  const [categories, setCategories] = useState<CategoryType[]>(() => {
    const storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : [];
  });
  const [accounts, setAccounts] = useState<AccountType[]>(() => {
    const storedAccounts = localStorage.getItem('accounts');
    return storedAccounts ? JSON.parse(storedAccounts) : [];
  });
  const [members, setMembers] = useState<MemberType[]>(() => {
    const storedMembers = localStorage.getItem('members');
    return storedMembers ? JSON.parse(storedMembers) : [];
  });
  const [books, setBooks] = useState<BookType[]>(() => {
    const storedBooks = localStorage.getItem('books');
    return storedBooks ? JSON.parse(storedBooks) : [{ id: '1', name: 'Personal Finance' }];
  });
  const [currentBook, setCurrentBook] = useState<BookType>(() => {
    const storedCurrentBook = localStorage.getItem('currentBook');
    return storedCurrentBook ? JSON.parse(storedCurrentBook) : { id: '1', name: 'Personal Finance' };
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Initialize default categories for a new book
  const initializeDefaultCategories = (bookId: string) => {
    const defaultCategories: CategoryType[] = [
      { id: uuidv4(), bookId, name: 'Food', icon: 'utensils' },
      { id: uuidv4(), bookId, name: 'Transportation', icon: 'car' },
      { id: uuidv4(), bookId, name: 'Shopping', icon: 'shopping-cart' },
      { id: uuidv4(), bookId, name: 'Housing', icon: 'home' },
      { id: uuidv4(), bookId, name: 'Entertainment', icon: 'smile' },
      { id: uuidv4(), bookId, name: 'Utilities', icon: 'wifi' },
      { id: uuidv4(), bookId, name: 'Gifts', icon: 'gift' },
      { id: uuidv4(), bookId, name: 'Health', icon: 'heart' },
      { id: uuidv4(), bookId, name: 'Clothing', icon: 'shirt' },
      { id: uuidv4(), bookId, name: 'Activities', icon: 'activity' },
      { id: uuidv4(), bookId, name: 'Travel', icon: 'landmark' },
      { id: uuidv4(), bookId, name: 'Others', icon: 'folder' },
      { id: uuidv4(), bookId, name: 'Salary', icon: 'briefcase' },
      { id: uuidv4(), bookId, name: 'Investment', icon: 'trending-up' },
      { id: uuidv4(), bookId, name: 'Bonus', icon: 'award' },
    ];
    setCategories(prev => [...prev, ...defaultCategories]);
  };

  // Initialize default accounts for a new book
  const initializeDefaultAccounts = (bookId: string) => {
    const defaultAccounts: AccountType[] = [
      { id: uuidv4(), bookId, name: 'Cash', type: 'Cash', balance: 0 },
      { id: uuidv4(), bookId, name: 'Bank', type: 'Bank', balance: 0 },
    ];
    setAccounts(prev => [...prev, ...defaultAccounts]);
  };

  // Initialize default member for a new book
  const initializeDefaultMember = (bookId: string) => {
    const defaultMember: MemberType = {
      id: uuidv4(),
      bookId,
      name: 'John Doe',
    };
    setMembers(prev => [...prev, defaultMember]);
  };

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);
  
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('currentBook', JSON.stringify(currentBook));
  }, [currentBook]);

  // Filter data based on current book
  const filteredTransactions = transactions.filter(t => t.bookId === currentBook.id);
  const filteredCategories = categories.filter(c => c.bookId === currentBook.id);
  const filteredAccounts = accounts.filter(a => a.bookId === currentBook.id);
  const filteredMembers = members.filter(m => m.bookId === currentBook.id);

  const addTransaction = (transaction: Omit<TransactionType, 'id' | 'bookId'>) => {
    const newTransaction: TransactionType = {
      id: uuidv4(),
      bookId: currentBook.id,
      ...transaction,
    };
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const addCategory = (category: Omit<CategoryType, 'id' | 'bookId'>) => {
    const newCategory: CategoryType = {
      id: uuidv4(),
      bookId: currentBook.id,
      ...category,
    };
    setCategories([...categories, newCategory]);
  };

  const addAccount = (name: string, type: AccountType['type'], balance: number) => {
    const newAccount: AccountType = {
      id: uuidv4(),
      bookId: currentBook.id,
      name,
      type,
      balance,
    };
    setAccounts([...accounts, newAccount]);
  };

  const updateAccount = (id: string, updates: Partial<Omit<AccountType, 'id' | 'bookId'>>) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, ...updates } : account
    ));
  };

  const addMember = (member: Omit<MemberType, 'id' | 'bookId'>) => {
    const newMember: MemberType = {
      id: uuidv4(),
      bookId: currentBook.id,
      ...member,
    };
    setMembers([...members, newMember]);
  };
  
  const addBook = (name: string) => {
    const newBook: BookType = {
      id: uuidv4(),
      name: name,
    };
    setBooks([...books, newBook]);
    setCurrentBook(newBook);
    
    // Initialize default data for the new book
    initializeDefaultCategories(newBook.id);
    initializeDefaultAccounts(newBook.id);
    initializeDefaultMember(newBook.id);
  };

  // Initialize default data for the first book if it doesn't exist
  useEffect(() => {
    if (categories.length === 0 || accounts.length === 0 || members.length === 0) {
      initializeDefaultCategories(currentBook.id);
      initializeDefaultAccounts(currentBook.id);
      initializeDefaultMember(currentBook.id);
    }
  }, []);

  const value: FinanceContextType = {
    transactions: filteredTransactions,
    categories: filteredCategories,
    accounts: filteredAccounts,
    members: filteredMembers,
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
