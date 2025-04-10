
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { BookOpen, Pencil, Check } from 'lucide-react';
import MonthlySummary from '@/components/MonthlySummary';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';

const Index = () => {
  const { currentBook, addBook } = useFinance();
  const [isEditingBookName, setIsEditingBookName] = useState(false);
  const [bookName, setBookName] = useState(currentBook.name);
  
  const handleSaveBookName = () => {
    if (bookName.trim()) {
      addBook(bookName);
      setIsEditingBookName(false);
    }
  };
  
  return (
    <Layout>
      <div className="pt-6 pb-20">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={24} />
                {isEditingBookName ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      className="border-white/30 bg-white/10 text-white"
                      placeholder="Book name"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white"
                      onClick={handleSaveBookName}
                    >
                      <Check size={18} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">{currentBook.name}</h1>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => setIsEditingBookName(true)}
                    >
                      <Pencil size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <MonthlySummary />
          <TransactionForm />
          <TransactionList />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
