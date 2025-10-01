import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog';
import type { SelectSKU } from './schema';
import { useSku } from './use-sku';

interface SkuDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sku: SelectSKU | null;
}

export const SkuDeleteDialog = ({ isOpen, onClose, sku }: SkuDeleteDialogProps) => {
  const { deleteSku, isLoading } = useSku();

  const handleDelete = async () => {
    if (!sku) return;
    const { success } = await deleteSku(sku.id);
    if (success) onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete SKU</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete SKU <b>{sku?.name}</b>? This action cannot be undone and will
            permanently delete the SKU.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              handleDelete();
              e.preventDefault();
            }}
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SkuDeleteDialog;
