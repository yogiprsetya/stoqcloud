'use client';

import { useState } from 'react';
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
import { stockOutFormSchema, StockOutFormData } from './schema';
import { useActionsStockOut } from '~/app/manage/stock-out/use-actions-stock-out';
import dynamic from 'next/dynamic';
import { SearchField } from '~/components/common/search-field';
import { Label } from '~/components/ui/label';

const SkuSearchDialog = dynamic(
  () => import('../sku-search-dialog').then((mod) => ({ default: mod.SkuSearchDialog })),
  {
    ssr: false
  }
);

interface StockOutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_ITEM_NAME = 56;

export function StockOutForm({ isOpen, onClose, onSuccess }: StockOutFormProps) {
  const [selectedSku, setSelectedSku] = useState<SelectSKU | null>(null);
  const [isSkuSearchOpen, setIsSkuSearchOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createStockOut, isLoading } = useActionsStockOut();

  const form = useForm<StockOutFormData>({
    resolver: zodResolver(stockOutFormSchema),
    defaultValues: {
      skuId: '',
      quantity: 1,
      unitPrice: 0,
      documentNumber: '',
      notes: ''
    }
  });

  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');

  const handleSkuSelect = (sku: SelectSKU) => {
    setSelectedSku(sku);
    form.setValue('skuId', sku.id);
    setError(null);
  };

  const onSubmit = async (data: StockOutFormData) => {
    try {
      setError(null);
      await createStockOut(data);
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to create stock-out transaction. Please try again.');
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedSku(null);
    setError(null);
    onClose();
  };

  const handleClearSku = () => {
    setSelectedSku(null);
    form.setValue('skuId', '');
    form.clearErrors('skuId');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-5" />
            Stock Out
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
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

            {/* Quantity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        min="1"
                        max={selectedSku?.stock || undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
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
              <div className="grid gap-1">
                <Label>Total Price</Label>

                <Input
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-muted"
                  value={quantity * unitPrice}
                />
              </div>
            </div>

            {/* Document Number */}
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Number</FormLabel>
                  <FormControl>
                    <Input placeholder="SO-2024-001" {...field} />
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Stock Out
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <SkuSearchDialog
        isOpen={isSkuSearchOpen}
        onClose={() => setIsSkuSearchOpen(false)}
        onSelect={handleSkuSelect}
      />
    </Dialog>
  );
}
