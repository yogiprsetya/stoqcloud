'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { supplierFormSchema, type SelectSupplier } from './schema';
import { useActionsSupplier } from './use-actions-supplier';
import z from 'zod';

type FormData = z.infer<typeof supplierFormSchema>;

interface SupplierCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editing?: SelectSupplier | null;
}

export const SupplierCreateDialog = ({ isOpen, onClose, editing }: SupplierCreateDialogProps) => {
  const { isLoading, createSupplier, updateSupplier } = useActionsSupplier();

  const form = useForm<FormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  // Reset form when modal opens/closes or when editing changes
  useEffect(() => {
    if (isOpen) {
      if (editing) {
        form.reset({
          name: editing.name,
          contactPerson: editing.contactPerson || '',
          email: editing.email || '',
          phone: editing.phone || '',
          address: editing.address || ''
        });
      } else {
        form.reset();
      }
    }
  }, [isOpen, editing, form]);

  const handleSubmit = async (data: FormData) => {
    const cleanedData = {
      name: data.name.trim(),
      contactPerson: data.contactPerson?.trim() || undefined,
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      address: data.address?.trim() || undefined
    };

    if (editing) {
      const { success } = await updateSupplier(cleanedData, editing.id);
      if (success) handleClose();
    } else {
      const { success } = await createSupplier(cleanedData);
      if (success) handleClose();
    }
  };

  const handleClose = () => {
    form.reset({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Supplier Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
