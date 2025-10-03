'use client';

import { X, Package, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { SelectSKU } from '~/app/manage/sku/schema';
import { useFetchSku } from '~/app/manage/sku/use-fetch-sku';
import { SearchField } from '~/components/common/search-field';

interface SkuSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sku: SelectSKU) => void;
}

export function SkuSearchDialog({ isOpen, onClose, onSelect }: SkuSearchDialogProps) {
  const { skus, isLoading, error, setKeyword, keyword } = useFetchSku({ disabled: !isOpen });

  const handleSelectSku = (sku: SelectSKU) => {
    onSelect(sku);
    onClose();
  };

  const handleClose = () => {
    setKeyword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-5" />
            Search SKU
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <SearchField
            placeholder="Search SKU by name or code..."
            value={keyword}
            onChange={(value) => setKeyword(value)}
          />

          {keyword && (
            <Button
              variant="ghost"
              size="sm"
              title="Clear search"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setKeyword('')}
            >
              <X />
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* SKU List */}
        <div className="flex-1 overflow-y-auto border rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin mr-2" />
              <span>Loading SKUs...</span>
            </div>
          ) : !skus || skus.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <div className="text-center">
                <Package className="size-12 mx-auto mb-2 opacity-50" />
                <p>No SKUs found</p>
                <p className="text-sm">Try adjusting your search term</p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {skus.map((sku) => (
                <div
                  key={sku.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleSelectSku(sku)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{sku.skuCode}</h3>
                        <Badge variant="outline" className="text-xs">
                          Stock: {sku.stock}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{sku.name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {sku.category && <span>Category: {sku.category.name}</span>}
                        {sku.supplier && <span>Supplier: {sku.supplier.name}</span>}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSku(sku);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
