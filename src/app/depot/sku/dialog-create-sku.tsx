'use client';

import { useEffect } from 'react';
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

type FormData = z.infer<typeof formSchema>;

interface CreateSkuModalProps {
  isOpen: boolean;
  onClose: () => void;
  editing?: SelectSKU | null;
}

export const DialogCreateSku = ({ isOpen, onClose, editing }: CreateSkuModalProps) => {
  const { isLoading, createSku, updateSku } = useSku();

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

  // Reset form when modal opens/closes or when editing changes
  useEffect(() => {
    if (isOpen) {
      if (editing) {
        form.reset({
          skuCode: editing.skuCode,
          name: editing.name,
          category: editing.category || '',
          supplier: editing.supplier || '',
          costPrice: Number(editing.costPrice),
          stock: editing.stock
        });
      }
    }
  }, [isOpen, editing, form]);

  const handleSubmit = (data: FormData) => {
    if (editing) {
      updateSku(data, editing.id);
    } else {
      createSku(data);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit SKU' : 'Tambah SKU Baru'}</DialogTitle>
        </DialogHeader>

        <Alert>
          <Barcode />
          <AlertTitle className="text-xs">Tips Barcode Scanner</AlertTitle>
          <AlertDescription className="text-xs">
            Arahkan cursor ke kolom SKU Code di atas, lalu gunakan barcode scanner untuk memindai kode barcode
            produk. Kode akan otomatis terisi di kolom tersebut.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="skuCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan SKU Code" {...field} />
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
                    <FormLabel>Nama Produk *</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama produk" {...field} />
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
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan kategori" {...field} />
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
                      <Input placeholder="Masukkan supplier" {...field} />
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
                    <FormLabel>Harga Beli</FormLabel>
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
                    <FormLabel>Stok</FormLabel>
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

            <DialogFooter className="flex gap-1">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Batal
              </Button>

              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? 'Menyimpan...' : editing ? 'Update' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
