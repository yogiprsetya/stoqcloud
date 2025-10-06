'use client';

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
import { SelectUser } from './schema';
import { useActionsUser } from './use-actions-user';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: SelectUser | null;
}

export function DeleteUserDialog({ isOpen, onClose, user }: DeleteUserDialogProps) {
  const { deleteUser, isLoading } = useActionsUser();

  const handleDelete = async () => {
    if (!user) return;
    const { success } = await deleteUser(user.id);
    if (success) onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete user <b>{user?.name}</b>? This action cannot be undone.
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
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
