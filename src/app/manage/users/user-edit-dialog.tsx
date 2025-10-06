'use client';

import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Label } from '~/components/ui/label';
import { SelectUser } from './schema';
import { useActionsUser } from './use-actions-user';

interface UserFormData {
  name: string;
  email: string;
  role: SelectUser['role'];
}

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: SelectUser | null;
}

export function EditUserDialog({ isOpen, onClose, user }: EditUserDialogProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'OPERATOR'
  });

  const { updateUser, isLoading } = useActionsUser();

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    const { success } = await updateUser(formData, user.id);
    if (success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Name</Label>

            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter user name"
            />
          </div>

          <div>
            <Label htmlFor="edit-email">Email</Label>

            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter user email"
            />
          </div>

          <div>
            <Label htmlFor="edit-role">Role</Label>

            <Select
              value={formData.role}
              onValueChange={(value: SelectUser['role']) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="OPERATOR">Operator</SelectItem>
                <SelectItem value="CASHIER">Cashier</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            disabled={isLoading}
            onClick={(e) => {
              handleSubmit();
              e.preventDefault();
            }}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
