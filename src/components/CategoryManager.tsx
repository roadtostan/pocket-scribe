
import React, { useState, useEffect } from 'react';
import { useFinance, CategoryType } from '@/context/FinanceContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import CategoryIcon from './CategoryIcon';
import AddCategoryDialog from './AddCategoryDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';

interface CategoryManagerProps {
  transactionType: 'income' | 'expense' | 'transfer';
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ transactionType }) => {
  const { categories, updateCategoryOrder } = useFinance();
  const [open, setOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState<CategoryType[]>([]);
  const isMobile = useIsMobile();

  // Filter categories based on transaction type
  useEffect(() => {
    const filtered = categories
      .filter(cat => {
        if (transactionType === 'income') {
          return cat.type === 'income' || cat.type === 'both';
        }
        return cat.type === 'expense' || cat.type === 'both';
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
    
    setLocalCategories(filtered);
  }, [categories, transactionType]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    
    if (!destination) return; // Dropped outside the list
    
    if (destination.droppableId === source.droppableId && 
        destination.index === source.index) {
      return; // Dropped in same position
    }
    
    // Reorder the local categories list
    const newCategoryOrder = Array.from(localCategories);
    const [movedItem] = newCategoryOrder.splice(source.index, 1);
    newCategoryOrder.splice(destination.index, 0, movedItem);
    
    // Update the local state immediately for responsive UI
    setLocalCategories(newCategoryOrder);
    
    // Prepare the updated categories with new sort orders
    const updatedCategories = newCategoryOrder.map((category, index) => ({
      ...category,
      sortOrder: index
    }));
    
    // Update categories in context/database
    updateCategoryOrder(updatedCategories)
      .then(() => {
        toast.success("Category order updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update category order");
        // Restore original order on failure
        setLocalCategories([...localCategories]);
      });
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="h-8 w-8 p-0"
      >
        <Settings className="h-4 w-4" />
        <span className="sr-only">Category Settings</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={cn(
          "max-w-lg",
          isMobile ? "w-[95vw] max-h-[95vh] overflow-y-auto" : ""
        )}>
          <DialogHeader>
            <DialogTitle>Manage {transactionType === 'income' ? 'Income' : 'Expense'} Categories</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop categories to change their order. The order will be saved automatically.
            </p>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <ul 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {localCategories.map((category, index) => (
                      <Draggable 
                        key={category.id} 
                        draggableId={category.id} 
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center p-3 border rounded-md bg-white hover:bg-gray-50 cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <CategoryIcon iconName={category.icon} />
                              <span>{category.name}</span>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
            
            <div className="mt-6">
              <AddCategoryDialog 
                transactionType={transactionType} 
                buttonLabel="Add New Category"
                buttonVariant="default"
                fullWidth={true}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryManager;
