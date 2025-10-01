'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { categoryFormSchema, type SelectCategory } from './schema';
import { useActionsCategory } from './use-actions-category';

type FormData = {
  name: string;
  description?: string;
};

interface CategoryCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editing?: SelectCategory | null;
}

export const CategoryCreateDialog = ({ isOpen, onClose, editing }: CategoryCreateDialogProps) => {
  const { isLoading, createCategory, updateCategory } = useActionsCategory();

  const form = useForm<FormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  // Reset form when modal opens/closes or when editing changes
  useEffect(() => {
    if (isOpen) {
      if (editing) {
        form.reset({
          name: editing.name,
          description: editing.description || ''
        });
      } else {
        form.reset({
          name: '',
          description: ''
        });
      }
    }
  }, [isOpen, editing, form]);

  const handleSubmit = async (data: FormData) => {
    const cleanedData = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined
    };

    if (editing) {
      const { success } = await updateCategory(cleanedData, editing?.id || '');
      if (success) handleClose();
    } else {
      const { success } = await createCategory(cleanedData);
      if (success) handleClose();
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (editing ? 'Updating...' : 'Saving...') : editing ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
