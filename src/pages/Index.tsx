
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { BookOpen, Pencil, Check, PlusCircle, Calendar } from 'lucide-react';
import MonthlySummary from '@/components/MonthlySummary';
import TransactionList from '@/components/TransactionList';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonthYearPicker from '@/components/MonthYearPicker';

const Index = () => {
  const { currentBook, addBook } = useFinance();
  const [isEditingBookName, setIsEditingBookName] = useState(false);
  const [bookName, setBookName] = useState(currentBook.name);
  const navigate = useNavigate();
  
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
          <MonthYearPicker />
          <MonthlySummary />
          
          <Button 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 text-lg"
            onClick={() => navigate('/add-transaction')}
          >
            <PlusCircle className="mr-2" size={20} />
            Add Transaction
          </Button>
          
          <Tabs defaultValue="list">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <TransactionList />
            </TabsContent>
            <TabsContent value="calendar">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-96 text-gray-400">
                    <Calendar size={64} className="opacity-20" />
                  </div>
                  <div className="text-center text-gray-500">
                    Calendar view coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
