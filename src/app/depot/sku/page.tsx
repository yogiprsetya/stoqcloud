'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { SelectSKU } from './schema';

const SkuTable = dynamic(() => import('./sku-table').then((m) => m.SkuTable), {
  ssr: false
});

const DialogCreateSku = dynamic(() => import('./dialog-create-sku').then((m) => m.DialogCreateSku), {
  ssr: false
});

// Using SelectSKU type from schema instead of custom type

// const formSchema = z.object({
//   skuCode: z.string().min(1),
//   name: z.string().min(1),
//   category: z.string().optional(),
//   supplier: z.string().optional(),
//   costPrice: z.coerce.number().nonnegative(),
//   stock: z.coerce.number().int().nonnegative()
// });

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

  // const onSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const parsed = formSchema.safeParse(form);
  //   if (!parsed.success) {
  //     setError('Form tidak valid');
  //     return;
  //   }
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     if (editing) {
  //       await fetch(`/api/sku/${editing.id}`, {
  //         method: 'PATCH',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(parsed.data)
  //       });
  //     } else {
  //       await fetch('/api/sku', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(parsed.data)
  //       });
  //     }
  //     resetForm();
  //     await load();
  //   } catch (e) {
  //     setError(e?.message || 'Gagal menyimpan');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
  //     setError(e?.message || 'Gagal menghapus');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">SKU Manager</h1>
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2"
            placeholder="Cari..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleOpenModal}
          >
            Tambah SKU
          </button>
        </div>
      </div>

      <SkuTable onEdit={handleEdit} />

      <DialogCreateSku isOpen={isModalOpen} onClose={handleCloseModal} editing={editing} />
    </div>
  );
}
