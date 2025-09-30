'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { SelectSKU } from './schema';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

const SkuTable = dynamic(() => import('./sku-table').then((m) => m.SkuTable), {
  ssr: false
});

const SkuCreateDialog = dynamic(() => import('./sku-create-dialog').then((m) => m.SkuCreateDialog), {
  ssr: false
});

export default function DepotSkuPage() {
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<SelectSKU | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // const onEdit = (item: Sku) => {
  //   setEditing(item);
  //   setForm({
  //     skuCode: item.skuCode,
  //     name: item.name,
  //     category: item.category || '',
  //     supplier: item.supplier || '',
  //     costPrice: Number(item.costPrice),
  //     stock: item.stock
  //   });
  // };

  // const onDelete = async (item: Sku) => {
  //   if (!confirm(`Hapus SKU ${item.skuCode}?`)) return;
  //   try {
  //     setLoading(true);
  //     await fetch(`/api/sku/${item.id}`, { method: 'DELETE' });
  //     await load();
  //   } catch (e: any) {
  //     setError(e?.message || 'Failed to delete');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">SKU Manager</h1>

        <div className="flex gap-2">
          <Input placeholder="Search ..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Button onClick={handleOpenModal}>Add SKU</Button>
        </div>
      </div>

      <SkuTable onEdit={handleEdit} />

      <SkuCreateDialog isOpen={isModalOpen} onClose={handleCloseModal} editing={editing} />
    </div>
  );
}
