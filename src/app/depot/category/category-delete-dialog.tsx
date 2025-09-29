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
import { useActionsCategory } from './use-actions-category';
import { type SelectCategory } from './schema';

interface CategoryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: SelectCategory | null;
}

export const CategoryDeleteDialog = ({ isOpen, onClose, category }: CategoryDeleteDialogProps) => {
  const { deleteCategory, isLoading } = useActionsCategory();

  const handleDelete = async () => {
    if (!category) return;

    const { success } = await deleteCategory(category.id);
    if (success) onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete the category <b>{category?.name}</b>? This action cannot be undone
            and will permanently delete the category.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleDelete} variant="destructive" disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
