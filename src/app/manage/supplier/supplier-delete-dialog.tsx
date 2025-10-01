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
import { useActionsSupplier } from './use-actions-supplier';
import { type SelectSupplier } from './schema';

interface SupplierDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SelectSupplier | null;
}

export const SupplierDeleteDialog = ({ isOpen, onClose, supplier }: SupplierDeleteDialogProps) => {
  const { deleteSupplier, isLoading } = useActionsSupplier();

  const handleDelete = async () => {
    if (!supplier) return;

    const { success } = await deleteSupplier(supplier.id);
    if (success) onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Supplier</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete the supplier <b>{supplier?.name}</b>? This action cannot be undone
            and will permanently delete the supplier.
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
