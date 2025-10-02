'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { SelectSKU } from './schema';
import { Button } from '~/components/ui/button';
import { useDebounce } from 'use-debounce';
import { SearchField } from '~/components/common/search-field';

const SkuTable = dynamic(() => import('./sku-table').then((m) => m.SkuTable), {
  ssr: false
});

const SkuCreateDialog = dynamic(() => import('./sku-create-dialog').then((m) => m.SkuCreateDialog), {
  ssr: false
});

const SkuDeleteDialog = dynamic(() => import('./sku-delete-dialog').then((m) => m.SkuDeleteDialog), {
  ssr: false
});

export default function DepotSkuPage() {
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<SelectSKU | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<SelectSKU | null>(null);

  const [debouncedQ] = useDebounce(q, 500);

  const handleOpenModal = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (item: SelectSKU) => {
    setEditing(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: SelectSKU) => {
    setDeleting(item);
    setIsDeleteOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">SKU Manager</h1>

        <div className="flex gap-2">
          <SearchField value={q} onChange={(value) => setQ(value)} placeholder="Search ..." />

          <Button onClick={handleOpenModal}>Add SKU</Button>
        </div>
      </div>

      <SkuTable onEdit={handleEdit} onDelete={handleDelete} keyword={debouncedQ} />

      <SkuCreateDialog isOpen={isModalOpen} onClose={handleCloseModal} editing={editing} />

      <SkuDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleting(null);
        }}
        sku={deleting}
      />
    </div>
  );
}
