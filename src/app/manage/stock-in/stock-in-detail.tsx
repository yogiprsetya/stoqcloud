'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { Calendar, Package, FileText, Hash, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { useStockInDetail } from '~/app/manage/stock-in/use-stock-in';
import { formatDetailDate } from '~/utils/date';
import { formatRp } from '~/utils/rupiah';

interface StockInDetailProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

export function StockInDetail({ isOpen, onClose, transactionId }: StockInDetailProps) {
  const { transaction, loading, error } = useStockInDetail(transactionId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock In Detail
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading transaction details...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {transaction && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Stock In Transaction</h3>
                <p className="text-sm text-muted-foreground">ID: {transaction.id}</p>
              </div>

              <Badge variant="default" className="bg-green-100 text-green-800">
                Completed
              </Badge>
            </div>

            <Separator />

            {/* SKU Information */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SKU Code</label>
                  <p className="font-mono">{transaction.sku.skuCode}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                  <p>{transaction.sku.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p>{transaction.sku.categoryName || '-'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Supplier</label>
                  <p>{transaction.sku.supplierName || '-'}</p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Transaction Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                  <p className="text-lg font-semibold text-green-600">+{transaction.quantity}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Unit Price</label>
                  <p>{formatRp(transaction.unitPrice)}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Total Price</label>
                  <p className="text-xl font-bold">{formatRp(transaction.totalPrice)}</p>
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Document Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Document Number</label>
                  <p className="font-mono">{transaction.documentNumber || '-'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction Date</label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDetailDate(transaction.createdAt)}
                  </p>
                </div>

                {transaction.notes && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="text-sm bg-background p-3 rounded border">{transaction.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-2 text-xs text-muted-foreground border-t pt-4">
              <p>Created: {formatDetailDate(transaction.createdAt)}</p>
              <p>Updated: {formatDetailDate(transaction.updatedAt)}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
