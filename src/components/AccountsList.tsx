import React, { useState } from 'react';
import { useFinance, AccountType } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from '@/lib/formatCurrency';
import { Plus, PenLine } from 'lucide-react';
import { toast } from 'sonner';

const AccountsList = () => {
  const { accounts, addAccount, updateAccount } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<AccountType['type']>('Cash');
  const [newAccountBalance, setNewAccountBalance] = useState('');
  const [accountToEdit, setAccountToEdit] = useState<AccountType | null>(null);
  const [editBalance, setEditBalance] = useState('');
  
  const accountTypes: AccountType['type'][] = [
    'Cash',
    'Conventional Bank',
    'Digital Bank',
    'Ewallet',
    'Investment',
    'Debt',
  ];
  
  const accountsByType = accounts.reduce((groups, account) => {
    if (!groups[account.type]) {
      groups[account.type] = [];
    }
    groups[account.type].push(account);
    return groups;
  }, {} as Record<AccountType['type'], AccountType[]>);
  
  const totalAssets = accounts
    .filter(account => account.type !== 'Debt')
    .reduce((sum, account) => sum + account.balance, 0);
  
  const totalDebt = accounts
    .filter(account => account.type === 'Debt')
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);

  const handleAddAccount = () => {
    if (!newAccountName.trim()) {
      toast.error('Account name is required');
      return;
    }
    
    const parsedBalance = parseFloat(newAccountBalance);
    if (isNaN(parsedBalance)) {
      toast.error('Please enter a valid balance');
      return;
    }
    
    const finalBalance = newAccountType === 'Debt' && parsedBalance > 0 
      ? -parsedBalance 
      : parsedBalance;
    
    addAccount(newAccountName, newAccountType, finalBalance);
    
    setNewAccountName('');
    setNewAccountType('Cash');
    setNewAccountBalance('');
    setIsAddDialogOpen(false);
    
    toast.success('Account added successfully');
  };

  const handleOpenEditDialog = (account: AccountType) => {
    setAccountToEdit(account);
    setEditBalance(Math.abs(account.balance).toString());
    setIsEditDialogOpen(true);
  };

  const handleUpdateBalance = () => {
    if (!accountToEdit) return;
    
    const parsedBalance = parseFloat(editBalance);
    if (isNaN(parsedBalance)) {
      toast.error('Please enter a valid balance');
      return;
    }
    
    const finalBalance = accountToEdit.type === 'Debt'
      ? -Math.abs(parsedBalance)
      : Math.abs(parsedBalance);
    
    updateAccount(accountToEdit.id, { balance: finalBalance });
    setIsEditDialogOpen(false);
    toast.success('Balance updated successfully');
  };

  return (
    <>
      <Card className="w-full mb-6 animate-fade-in">
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Assets</div>
              <div className="text-xl font-semibold text-green-600">
                {formatCurrency(totalAssets)}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Debt</div>
              <div className="text-xl font-semibold text-red-600">
                {formatCurrency(totalDebt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Accounts</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="e.g., BCA, OVO, Cash"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Select value={newAccountType} onValueChange={(value) => setNewAccountType(value as AccountType['type'])}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="balance">Initial Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  value={newAccountBalance}
                  onChange={(e) => setNewAccountBalance(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <Button onClick={handleAddAccount} className="w-full">
                Add Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {Object.entries(accountsByType).map(([type, accounts]) => (
        <Card key={type} className="w-full mb-4 animate-fade-in">
          <CardHeader>
            <CardTitle>{type}</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {accounts.map(account => (
              <div key={account.id} className="flex justify-between items-center p-4 border-b last:border-0">
                <span className="font-medium">{account.name}</span>
                <div className="flex items-center gap-2">
                  <span className={account.balance < 0 ? 'text-expense' : ''}>
                    {formatCurrency(account.balance)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEditDialog(account)}
                    className="h-8 w-8"
                  >
                    <PenLine size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Balance</DialogTitle>
          </DialogHeader>
          {accountToEdit && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Account</div>
                <div className="font-medium">{accountToEdit.name} ({accountToEdit.type})</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editBalance">
                  {accountToEdit.type === 'Debt' ? 'Debt Amount' : 'Current Balance'}
                </Label>
                <Input
                  id="editBalance"
                  type="number"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                />
              </div>
              
              <Button onClick={handleUpdateBalance} className="w-full">
                Update Balance
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountsList;
