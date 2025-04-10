import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type TransactionType = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  accountId: string;
  memberId: string;
  date: string;
  description: string;
};

type CategoryType = {
  id: string;
  name: string;
  icon: string;
};

type AccountType = {
  id: string;
  name: string;
  type: 'Cash' | 'Bank' | 'Credit Card' | 'Investment' | 'Debt';
  balance: number;
};

type MemberType = {
  id: string;
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
  
  addTransaction: (transaction: Omit<TransactionType, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<CategoryType, 'id'>) => void;
  addAccount: (account: Omit<AccountType, 'id'>) => void;
  addMember: (member: Omit<MemberType, 'id'>) => void;
  addBook: (name: string) => void;
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
    return storedCategories ? JSON.parse(storedCategories) : [
      { id: '1', name: 'Food', icon: 'utensils' },
      { id: '2', name: 'Transportation', icon: 'car' },
      { id: '3', name: 'Shopping', icon: 'shopping-cart' },
      { id: '4', name: 'Housing', icon: 'home' },
      { id: '5', name: 'Entertainment', icon: 'smile' },
      { id: '6', name: 'Utilities', icon: 'wifi' },
      { id: '7', name: 'Gifts', icon: 'gift' },
      { id: '8', name: 'Health', icon: 'heart' },
      { id: '9', name: 'Clothing', icon: 'shirt' },
      { id: '10', name: 'Activities', icon: 'activity' },
      { id: '11', name: 'Travel', icon: 'landmark' },
      { id: '12', name: 'Others', icon: 'folder' },
      { id: '13', name: 'Salary', icon: 'briefcase' },
      { id: '14', name: 'Investment', icon: 'trending-up' },
      { id: '15', name: 'Bonus', icon: 'award' },
    ];
  });
  const [accounts, setAccounts] = useState<AccountType[]>(() => {
    const storedAccounts = localStorage.getItem('accounts');
    return storedAccounts ? JSON.parse(storedAccounts) : [
      { id: '1', name: 'Cash', type: 'Cash', balance: 0 },
      { id: '2', name: 'Bank', type: 'Bank', balance: 0 },
    ];
  });
  const [members, setMembers] = useState<MemberType[]>(() => {
    const storedMembers = localStorage.getItem('members');
    return storedMembers ? JSON.parse(storedMembers) : [
      { id: '1', name: 'John Doe' },
    ];
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

  const addTransaction = (transaction: Omit<TransactionType, 'id'>) => {
    const newTransaction: TransactionType = {
      id: uuidv4(),
      ...transaction,
    };
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const addCategory = (category: Omit<CategoryType, 'id'>) => {
    const newCategory: CategoryType = {
      id: uuidv4(),
      ...category,
    };
    setCategories([...categories, newCategory]);
  };

  const addAccount = (account: Omit<AccountType, 'id'>) => {
    const newAccount: AccountType = {
      id: uuidv4(),
      ...account,
    };
    setAccounts([...accounts, newAccount]);
  };

  const addMember = (member: Omit<MemberType, 'id'>) => {
    const newMember: MemberType = {
      id: uuidv4(),
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
  };

  const value: FinanceContextType = {
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
    addMember,
    addBook,
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
