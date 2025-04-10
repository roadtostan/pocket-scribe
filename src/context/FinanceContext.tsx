
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type CategoryType = {
  id: string;
  name: string;
  icon: string;
};

export type MemberType = {
  id: string;
  name: string;
};

export type AccountType = {
  id: string;
  name: string;
  type: 'Cash' | 'Conventional Bank' | 'Digital Bank' | 'Ewallet' | 'Investment' | 'Debt';
  balance: number;
};

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

export type BookType = {
  id: string;
  name: string;
};

type FinanceContextType = {
  books: BookType[];
  currentBook: BookType;
  categories: CategoryType[];
  members: MemberType[];
  accounts: AccountType[];
  transactions: TransactionType[];
  setCurrentBook: (book: BookType) => void;
  addBook: (name: string) => void;
  addCategory: (name: string, icon: string) => void;
  addMember: (name: string) => void;
  addAccount: (name: string, type: AccountType['type'], balance: number) => void;
  addTransaction: (transaction: Omit<TransactionType, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateAccount: (id: string, data: Partial<AccountType>) => void;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

type FinanceProviderProps = {
  children: ReactNode;
};

export const FinanceProvider = ({ children }: FinanceProviderProps) => {
  // Default categories
  const [categories, setCategories] = useState<CategoryType[]>([
    { id: '1', name: 'Food', icon: 'utensils' },
    { id: '2', name: 'Transportation', icon: 'car' },
    { id: '3', name: 'Daily necessities', icon: 'shopping-cart' },
    { id: '4', name: 'Housing', icon: 'home' },
    { id: '5', name: 'Skincare', icon: 'smile' },
    { id: '6', name: 'Internet', icon: 'wifi' },
    { id: '7', name: 'Gifts', icon: 'gift' },
    { id: '8', name: 'Healing', icon: 'heart' },
    { id: '9', name: 'Clothing', icon: 'shirt' },
    { id: '10', name: 'Medical', icon: 'first-aid' },
    { id: '11', name: 'Tax', icon: 'landmark' },
    { id: '12', name: 'Others', icon: 'folder' },
    { id: '13', name: 'Salary', icon: 'briefcase' },
    { id: '14', name: 'Investment', icon: 'trending-up' },
    { id: '15', name: 'Bonus', icon: 'award' },
  ]);

  // Default members
  const [members, setMembers] = useState<MemberType[]>([
    { id: '1', name: 'Self' },
    { id: '2', name: 'Husband' },
    { id: '3', name: 'Wife' },
    { id: '4', name: 'Children' },
    { id: '5', name: 'Parents' },
  ]);

  // Default accounts
  const [accounts, setAccounts] = useState<AccountType[]>([
    { id: '1', name: 'Cash', type: 'Cash', balance: 1000000 },
    { id: '2', name: 'BRI', type: 'Conventional Bank', balance: 2500000 },
    { id: '3', name: 'BNI', type: 'Conventional Bank', balance: 1800000 },
    { id: '4', name: 'BSI', type: 'Conventional Bank', balance: 3000000 },
    { id: '5', name: 'Seabank', type: 'Digital Bank', balance: 1200000 },
    { id: '6', name: 'ShopeePay', type: 'Ewallet', balance: 500000 },
    { id: '7', name: 'GoPay', type: 'Ewallet', balance: 350000 },
    { id: '8', name: 'Bibit', type: 'Investment', balance: 5000000 },
    { id: '9', name: 'Credit Card', type: 'Debt', balance: -2000000 },
  ]);

  // Sample transactions
  const [transactions, setTransactions] = useState<TransactionType[]>([
    {
      id: '1',
      amount: 50000,
      type: 'expense',
      categoryId: '1',
      accountId: '1',
      memberId: '1',
      date: '2024-04-10',
      description: 'Lunch at restaurant',
    },
    {
      id: '2',
      amount: 25000,
      type: 'expense',
      categoryId: '2',
      accountId: '1',
      memberId: '1',
      date: '2024-04-10',
      description: 'Bus fare',
    },
    {
      id: '3',
      amount: 5000000,
      type: 'income',
      categoryId: '13',
      accountId: '2',
      memberId: '2',
      date: '2024-04-01',
      description: 'Monthly salary',
    },
    {
      id: '4',
      amount: 3000000,
      type: 'income',
      categoryId: '13',
      accountId: '3',
      memberId: '3',
      date: '2024-04-01',
      description: 'Monthly salary',
    },
    {
      id: '5',
      amount: 1000000,
      type: 'expense',
      categoryId: '4',
      accountId: '2',
      memberId: '1',
      date: '2024-04-05',
      description: 'Rent payment',
    },
    {
      id: '6',
      amount: 200000,
      type: 'expense',
      categoryId: '6',
      accountId: '7',
      memberId: '1',
      date: '2024-04-08',
      description: 'Internet bill',
    },
    {
      id: '7',
      amount: 350000,
      type: 'expense',
      categoryId: '5',
      accountId: '6',
      memberId: '3',
      date: '2024-04-09',
      description: 'Skincare products',
    },
  ]);

  const [books, setBooks] = useState<BookType[]>([
    { id: '1', name: 'Household Budget' },
  ]);

  const [currentBook, setCurrentBook] = useState<BookType>(books[0]);

  const addBook = (name: string) => {
    const newBook = {
      id: crypto.randomUUID(),
      name,
    };
    setBooks([...books, newBook]);
    setCurrentBook(newBook);
  };

  const addCategory = (name: string, icon: string) => {
    setCategories([...categories, { id: crypto.randomUUID(), name, icon }]);
  };

  const addMember = (name: string) => {
    setMembers([...members, { id: crypto.randomUUID(), name }]);
  };

  const addAccount = (name: string, type: AccountType['type'], balance: number) => {
    setAccounts([...accounts, { id: crypto.randomUUID(), name, type, balance }]);
  };

  const addTransaction = (transaction: Omit<TransactionType, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    
    // Update account balance
    const updatedAccounts = accounts.map(account => {
      if (account.id === transaction.accountId) {
        return {
          ...account,
          balance: transaction.type === 'income' 
            ? account.balance + transaction.amount
            : account.balance - transaction.amount
        };
      }
      return account;
    });
    
    setAccounts(updatedAccounts);
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    
    if (transaction) {
      // Reverse the effect on account balance
      const updatedAccounts = accounts.map(account => {
        if (account.id === transaction.accountId) {
          return {
            ...account,
            balance: transaction.type === 'income' 
              ? account.balance - transaction.amount
              : account.balance + transaction.amount
          };
        }
        return account;
      });
      
      setAccounts(updatedAccounts);
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const updateAccount = (id: string, data: Partial<AccountType>) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, ...data } : account
    ));
  };

  const value = {
    books,
    currentBook,
    categories,
    members,
    accounts,
    transactions,
    setCurrentBook,
    addBook,
    addCategory,
    addMember,
    addAccount,
    addTransaction,
    deleteTransaction,
    updateAccount,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
