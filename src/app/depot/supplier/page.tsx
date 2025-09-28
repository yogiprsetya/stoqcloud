'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, User } from 'lucide-react';
import { useFetchSupplier } from './use-fetch-supplier';
import { type SelectSupplier } from './schema';
import { SupplierCreateDialog } from './supplier-create-dialog';

export default function SupplierPage() {
  const { isLoading, suppliers } = useFetchSupplier();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SelectSupplier | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Supplier Management</h1>
          <p className="text-muted-foreground">Manage product suppliers</p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />

            <Input
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading suppliers...</div>
      ) : suppliers?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm
            ? 'No suppliers found matching your search.'
            : 'No suppliers found. Create your first supplier.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers?.map((supplier) => (
            <Card key={supplier.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{supplier.name}</h3>

                    {supplier.contactPerson && (
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        {supplier.contactPerson}
                      </div>
                    )}

                    {supplier.email && (
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        {supplier.email}
                      </div>
                    )}

                    {supplier.phone && (
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        {supplier.phone}
                      </div>
                    )}

                    {supplier.address && (
                      <div className="flex items-start mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{supplier.address}</span>
                      </div>
                    )}

                    <Badge variant="secondary" className="mt-3">
                      Created {new Date(supplier.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>

                  <div className="flex space-x-1 ml-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingSupplier(supplier)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SupplierCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingSupplier(null);
        }}
        editing={editingSupplier}
      />
    </div>
  );
}
