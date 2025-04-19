
import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from 'sonner';

const AddMemberDialog = () => {
  const [name, setName] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const { addMember } = useFinance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Please enter a name');
      return;
    }

    addMember({ name });
    toast.success('Member added successfully');
    setName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Member Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter member name"
            />
          </div>
          <Button type="submit" className="w-full">Add Member</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
