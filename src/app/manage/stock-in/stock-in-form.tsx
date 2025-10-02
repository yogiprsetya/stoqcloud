'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Package, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { SelectSKU } from '../sku/schema';
import { stockInFormSchema, StockInFormData } from './schema';
import { useSku } from '~/app/manage/stock-in/use-sku';
import { useSupplier } from '~/app/manage/stock-in/use-supplier';
import { useActionsStockIn } from '~/app/manage/stock-in/use-actions-stock-in';

interface StockInFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_ITEM_NAME = 44;

export function StockInForm({ isOpen, onClose, onSuccess }: StockInFormProps) {
  const [selectedSku, setSelectedSku] = useState<SelectSKU | null>(null);

  // Hooks untuk data dan API calls
  const { skus, loading: skusLoading, error: skusError } = useSku();
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

  const handleSkuChange = (skuId: string) => {
    const sku = skus.find((s) => s.id === skuId);
    setSelectedSku(sku || null);
    form.setValue('skuId', skuId);
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
        {(skusError || suppliersError) && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{skusError || suppliersError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* SKU Selection */}
            <FormField
              control={form.control}
              name="skuId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select SKU</FormLabel>
                  <Select onValueChange={handleSkuChange} value={field.value} disabled={skusLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={skusLoading ? 'Loading SKUs...' : 'Select SKU to stock in'}
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {skus.map((sku) => (
                        <SelectItem key={sku.id} value={sku.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {sku.skuCode} -{' '}
                              {sku.name.length > MAX_ITEM_NAME
                                ? sku.name.slice(0, MAX_ITEM_NAME) + '...'
                                : sku.name}
                            </span>

                            <span className="text-sm text-muted-foreground">
                              Current stock: {sku.stock} | {sku.category?.name} | {sku.supplier?.name}
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
                <AlertCircle className="size-4" />
                <AlertDescription>
                  <strong>{selectedSku.skuCode}</strong> - {selectedSku.name}
                  <br />
                  Current stock: <Badge variant="outline">{selectedSku.stock}</Badge>
                  <br />
                  Category: {selectedSku.category?.name} | Supplier: {selectedSku.supplier?.name}
                </AlertDescription>
              </Alert>
            )}

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
              <Button type="submit" disabled={submitting || skusLoading || suppliersLoading}>
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
    </Dialog>
  );
}
