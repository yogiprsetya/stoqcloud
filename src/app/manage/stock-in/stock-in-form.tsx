'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Package, AlertCircle, Loader2, X } from 'lucide-react';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { SelectSKU } from '../sku/schema';
import { stockInFormSchema, StockInFormData } from './schema';
import { useSupplier } from '~/app/manage/stock-in/use-supplier';
import { useActionsStockIn } from '~/app/manage/stock-in/use-actions-stock-in';
import dynamic from 'next/dynamic';
import { SearchField } from '~/components/common/search-field';

const SkuSearchDialog = dynamic(
  () => import('./sku-search-dialog').then((mod) => ({ default: mod.SkuSearchDialog })),
  {
    ssr: false
  }
);

interface StockInFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_ITEM_NAME = 56;

export function StockInForm({ isOpen, onClose, onSuccess }: StockInFormProps) {
  const [selectedSku, setSelectedSku] = useState<SelectSKU | null>(null);
  const [isSkuSearchOpen, setIsSkuSearchOpen] = useState(false);

  // Hooks untuk data dan API calls
  const { loading: suppliersLoading, error: suppliersError } = useSupplier();
  const { createStockIn, isLoading: submitting } = useActionsStockIn();

  const form = useForm<StockInFormData>({
    resolver: zodResolver(stockInFormSchema),
    defaultValues: {
      skuId: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      documentNumber: '',
      notes: ''
    }
  });

  // Watch quantity dan unitPrice untuk auto-calculate totalPrice
  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');

  useEffect(() => {
    const total = quantity * unitPrice;
    form.setValue('totalPrice', total);
  }, [quantity, unitPrice, form]);

  const onSubmit = async (data: StockInFormData) => {
    // Validasi tambahan untuk memastikan SKU dipilih
    if (!selectedSku) {
      form.setError('skuId', { message: 'Please select a SKU' });
      return;
    }

    const result = await createStockIn(data);

    if (result?.success) {
      // Reset form and close dialog on success
      form.reset();
      setSelectedSku(null);
      onClose();

      // Trigger refresh di parent component
      onSuccess?.();
    }
  };

  const handleSkuSelect = (sku: SelectSKU) => {
    setSelectedSku(sku);
    form.setValue('skuId', sku.id);
    form.clearErrors('skuId');
  };

  const handleClearSku = () => {
    setSelectedSku(null);
    form.setValue('skuId', '');
    form.clearErrors('skuId');
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-5" />
            New Stock In
          </DialogTitle>
        </DialogHeader>

        {/* Error Messages */}
        {suppliersError && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{suppliersError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex gap-2">
            <SearchField
              placeholder="Click Select to choose SKU..."
              value={selectedSku ? `${selectedSku.skuCode} - ${selectedSku.name}` : ''}
              readOnly
              onClick={() => setIsSkuSearchOpen(true)}
              className="flex-1"
            />

            {selectedSku && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Clear selected SKU"
                onClick={handleClearSku}
                className="shrink-0"
              >
                <X />
              </Button>
            )}
          </div>

          {/* Selected SKU Info */}
          {selectedSku && (
            <Alert>
              <AlertDescription>
                <div title={selectedSku.name} className="mb-2">
                  <b>{selectedSku.skuCode}</b> -{' '}
                  {selectedSku.name.length > MAX_ITEM_NAME
                    ? selectedSku.name.slice(0, MAX_ITEM_NAME) + '...'
                    : selectedSku.name}
                </div>

                <div>
                  Current stock:{' '}
                  <Badge variant="outline" size="sm">
                    {selectedSku.stock}
                  </Badge>
                </div>

                <div>
                  {selectedSku.category?.name} | {selectedSku.supplier?.name}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Input {...form.register('skuId')} readOnly className="hidden" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        placeholder="Enter quantity"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unit Price */}
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Price */}
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" readOnly className="bg-muted" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Document Number */}
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="PO-2024-001, GRN-001, etc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes if needed..."
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
              <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || suppliersLoading}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Stock In'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {/* SKU Search Dialog */}
      <SkuSearchDialog
        isOpen={isSkuSearchOpen}
        onClose={() => setIsSkuSearchOpen(false)}
        onSelect={handleSkuSelect}
      />
    </Dialog>
  );
}
