'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Barcode, Info } from 'lucide-react';
import { formSchema, type SelectSKU } from './schema';
import { useSku } from './use-sku';
import { If } from '~/components/ui/if';

type FormData = z.infer<typeof formSchema>;

interface CreateSkuModalProps {
  isOpen: boolean;
  onClose: () => void;
  editing?: SelectSKU | null;
}

type SubmitIntention = 'save' | 'save-and-create';

export const SkuCreateDialog = ({ isOpen, onClose, editing }: CreateSkuModalProps) => {
  const { isLoading, createSku, updateSku } = useSku();
  const [submitIntention, setSubmitIntention] = useState<SubmitIntention>('save');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skuCode: '',
      name: '',
      category: '',
      supplier: '',
      costPrice: 0,
      stock: 0
    }
  });

  const {
    formState: { isValid }
  } = form;

  // Reset form when modal opens/closes or when editing changes
  useEffect(() => {
    if (isOpen && editing) {
      form.reset({
        skuCode: editing.skuCode,
        name: editing.name,
        category: editing.category || '',
        supplier: editing.supplier || '',
        costPrice: Number(editing.costPrice),
        stock: editing.stock
      });
    }
  }, [isOpen, editing, form]);

  const handleSubmit = async (data: FormData, intention: SubmitIntention = 'save') => {
    if (editing) {
      const { success } = await updateSku(data, editing.id);
      if (success) handleClose();
    } else {
      const { success } = await createSku(data);
      if (success) {
        if (intention === 'save-and-create') {
          form.reset();
          setTimeout(() => form.setFocus('skuCode'), 100);
        } else {
          handleClose();
        }
      }
    }
  };

  const handleSave = () => {
    setSubmitIntention('save');
    form.handleSubmit((data) => handleSubmit(data, 'save'))();
  };

  const handleSaveAndCreate = () => {
    setSubmitIntention('save-and-create');
    form.handleSubmit((data) => handleSubmit(data, 'save-and-create'))();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit SKU' : 'Add New SKU'}</DialogTitle>
        </DialogHeader>

        <Alert>
          <Barcode />
          <AlertTitle className="text-xs">Barcode Scanner Tips</AlertTitle>
          <AlertDescription className="text-xs">
            Point your cursor to the SKU Code field above, then use a barcode scanner to scan the product
            barcode. The code will automatically fill in the field.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="skuCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="lg" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>

              <Button type="button" size="lg" disabled={isLoading || !isValid} onClick={handleSave}>
                {isLoading && submitIntention === 'save' ? 'Saving...' : editing ? 'Update' : 'Save'}
              </Button>

              <If condition={!editing}>
                <Button
                  type="button"
                  size="lg"
                  disabled={isLoading || !isValid}
                  onClick={handleSaveAndCreate}
                >
                  {isLoading && submitIntention === 'save-and-create' ? 'Saving...' : 'Save & Add'}
                </Button>
              </If>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
