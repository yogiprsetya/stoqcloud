'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Search, Edit, Trash2 } from 'lucide-react';
import { useFetchCategory } from './use-fetch-category';
import { type SelectCategory } from './schema';

const CategoryCreateDialog = dynamic(
  () => import('./category-create-dialog').then((module) => ({ default: module.CategoryCreateDialog })),
  {
    ssr: false
  }
);

const CategoryDeleteDialog = dynamic(
  () => import('./category-delete-dialog').then((module) => ({ default: module.CategoryDeleteDialog })),
  {
    ssr: false
  }
);

export default function CategoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SelectCategory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<SelectCategory | null>(null);

  const { categories, isLoading } = useFetchCategory();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />

            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={() => setIsCreateDialogOpen(true)}>Add Category</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : categories?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm
            ? 'No categories found matching your search.'
            : 'No categories found. Create your first category.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => (
            <Card key={category.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                    <Badge variant="secondary" className="mt-2">
                      Created {new Date(category.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>

                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category);
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeletingCategory(category);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingCategory(null);
        }}
        editing={editingCategory}
      />

      <CategoryDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingCategory(null);
        }}
        category={deletingCategory}
      />
    </div>
  );
}
