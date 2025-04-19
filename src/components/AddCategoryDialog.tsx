
import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from 'sonner';

const ICONS = [
  'utensils', 'car', 'shopping-cart', 'home', 'smile', 'wifi',
  'gift', 'heart', 'shirt', 'activity', 'landmark', 'folder',
  'briefcase', 'trending-up', 'award'
];

interface AddCategoryDialogProps {
  transactionType?: 'income' | 'expense' | 'transfer';
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ transactionType = 'expense' }) => {
  const [name, setName] = React.useState('');
  const [selectedIcon, setSelectedIcon] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const { addCategory } = useFinance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !selectedIcon) {
      toast.error('Please fill all required fields');
      return;
    }
    
    addCategory({
      name,
      icon: selectedIcon,
      type: transactionType === 'income' ? 'income' : 'expense'
    });
    
    setName('');
    setSelectedIcon('');
    setOpen(false);
    
    toast.success('Category added successfully');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={selectedIcon} onValueChange={setSelectedIcon}>
              <SelectTrigger id="icon">
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {ICONS.map((iconName) => (
                  <SelectItem key={iconName} value={iconName}>
                    {iconName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Add Category</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
