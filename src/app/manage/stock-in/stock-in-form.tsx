'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { DatePicker } from '~/components/ui/date-picker';

const stockInSchema = z.object({
  skuId: z.string().min(1, 'SKU harus dipilih'),
  quantity: z.number().min(1, 'Quantity harus lebih dari 0'),
  documentNumber: z.string().min(1, 'Nomor dokumen harus diisi'),
  supplierId: z.string().min(1, 'Supplier harus dipilih'),
  notes: z.string().optional(),
  receivedDate: z.date({
    message: 'Tanggal penerimaan harus diisi'
  })
});

type StockInFormData = z.infer<typeof stockInSchema>;

interface StockInFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data - nantinya akan diambil dari API
const mockSkus = [
  { id: '1', code: 'SKU001', name: 'Laptop Dell XPS 13', currentStock: 5 },
  { id: '2', code: 'SKU002', name: 'Mouse Wireless Logitech', currentStock: 25 },
  { id: '3', code: 'SKU003', name: 'Keyboard Mechanical', currentStock: 12 }
];

const mockSuppliers = [
  { id: '1', name: 'PT. Teknologi Indonesia' },
  { id: '2', name: 'CV. Elektronik Jaya' },
  { id: '3', name: 'UD. Komputer Mandiri' }
];

export function StockInForm({ isOpen, onClose }: StockInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSku, setSelectedSku] = useState<unknown>(null);

  const form = useForm<StockInFormData>({
    resolver: zodResolver(stockInSchema),
    defaultValues: {
      skuId: '',
      quantity: 0,
      documentNumber: '',
      supplierId: '',
      notes: '',
      receivedDate: new Date()
    }
  });

  const onSubmit = async (data: StockInFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      console.log('Stock In Data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form and close dialog
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting stock in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkuChange = (skuId: string) => {
    const sku = mockSkus.find((s) => s.id === skuId);
    setSelectedSku(sku);
    form.setValue('skuId', skuId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock In Baru
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* SKU Selection */}
            <FormField
              control={form.control}
              name="skuId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih SKU</FormLabel>
                  <Select onValueChange={handleSkuChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih SKU yang akan di-stock in" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSkus.map((sku) => (
                        <SelectItem key={sku.id} value={sku.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {sku.code} - {sku.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Stok saat ini: {sku.currentStock}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected SKU Info */}
            {selectedSku && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{selectedSku.code}</strong> - {selectedSku.name}
                  <br />
                  Stok saat ini: <Badge variant="outline">{selectedSku.currentStock}</Badge>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Masukkan jumlah"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Received Date */}
              <FormField
                control={form.control}
                name="receivedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Penerimaan</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pilih tanggal penerimaan"
                        dateFormat="dd/MM/yyyy"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Document Number */}
              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Dokumen</FormLabel>
                    <FormControl>
                      <Input placeholder="PO-2024-001, GRN-001, dll" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Supplier */}
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockSuppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tambahkan catatan jika diperlukan..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Stock In'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
