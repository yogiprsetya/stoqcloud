'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { DataTable } from '~/components/common/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Shield, User } from 'lucide-react';
import { useFetchUser } from './use-fetch-user';
import { SearchField } from '~/components/common/search-field';
import dynamic from 'next/dynamic';
import { SelectUser } from './schema';

const EditUserDialog = dynamic(() => import('./user-edit-dialog').then((m) => m.EditUserDialog), {
  ssr: false
});

const DeleteUserDialog = dynamic(() => import('./user-delete-dialog').then((m) => m.DeleteUserDialog), {
  ssr: false
});

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectUser | null>(null);

  const { users, isLoading, setSearchTerm, searchTerm } = useFetchUser();

  const columns: ColumnDef<SelectUser>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={row.original?.image} />
            <AvatarFallback>{row.original?.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="font-medium">{row.original?.name}</div>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.role;

        if (role === 'MANAGER') {
          return (
            <Badge variant="default">
              <Shield className="size-4 mr-2" />
              Manager
            </Badge>
          );
        }

        if (role === 'OPERATOR') {
          return (
            <Badge variant="secondary">
              <User />
              Operator
            </Badge>
          );
        }

        if (role === 'CASHIER') {
          return (
            <Badge variant="secondary">
              <User />
              Cashier
            </Badge>
          );
        }
      }
    },
    {
      accessorKey: 'emailVerified',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.emailVerified ? 'default' : 'destructive'}>
          {row.original.emailVerified ? 'Verified' : 'Unverified'}
        </Badge>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(row.original)}>
              <Edit />
              Edit
            </DropdownMenuItem>

            {row.original.id !== session?.user?.id && (
              <DropdownMenuItem onClick={() => openDeleteDialog(row.original)} className="text-destructive">
                <Trash2 />
                Hapus
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'MANAGER') {
      router.push('/manage');
    }
  }, [session, status, router]);

  const openEditDialog = (user: SelectUser) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: SelectUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleActionSuccess = () => {
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  if (!session || session.user.role !== 'MANAGER') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage users and roles in the system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Manage all users registered in the system</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <SearchField
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              placeholder="Search users..."
            />
          </div>

          <DataTable columns={columns} data={users || []} isLoading={isLoading} />
        </CardContent>
      </Card>

      <EditUserDialog isOpen={isEditDialogOpen} onClose={handleActionSuccess} user={selectedUser} />

      <DeleteUserDialog isOpen={isDeleteDialogOpen} onClose={handleActionSuccess} user={selectedUser} />
    </div>
  );
}
