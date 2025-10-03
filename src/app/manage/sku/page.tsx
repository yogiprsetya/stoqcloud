'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { SelectSKU } from './schema';

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
  const [editing, setEditing] = useState<SelectSKU | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<SelectSKU | null>(null);

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
      <div className="mb-6">
        <h1 className="text-xl font-semibold">SKU Manager</h1>
        <p className="text-muted-foreground">Manage data master SKUs</p>
      </div>

      <SkuTable onEdit={handleEdit} onDelete={handleDelete} handleOpenModal={handleOpenModal} />

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
