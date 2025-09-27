'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const SkuTable = dynamic(() => import('./sku-table').then((m) => m.SkuTable), {
  ssr: false
});

type Sku = {
  id: string;
  skuCode: string;
  name: string;
  category: string | null;
  supplier: string | null;
  costPrice: string; // decimal comes as string
  stock: number;
  createdAt: string;
  updatedAt: string;
};

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
  const [editing, setEditing] = useState<Sku | null>(null);
  const [form, setForm] = useState({
    skuCode: '',
    name: '',
    category: '',
    supplier: '',
    costPrice: 0,
    stock: 0
  });

  const resetForm = () => {
    setForm({ skuCode: '', name: '', category: '', supplier: '', costPrice: 0, stock: 0 });
    setEditing(null);
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
            className="px-3 py-2 border rounded"
            // onClick={load} disabled={loading}
          >
            Cari
          </button>
        </div>
      </div>

      {/* {error && <div className="mb-4 text-red-600">{error}</div>} */}

      <form
        // onSubmit={onSubmit}
        className="grid grid-cols-6 gap-3 mb-6"
      >
        <input
          className="border px-3 py-2 col-span-2"
          placeholder="SKU Code"
          value={form.skuCode}
          onChange={(e) => setForm((f) => ({ ...f, skuCode: e.target.value }))}
        />
        <input
          className="border px-3 py-2 col-span-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          className="border px-3 py-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
        <input
          className="border px-3 py-2"
          placeholder="Supplier"
          value={form.supplier}
          onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))}
        />
        <input
          className="border px-3 py-2"
          type="number"
          step="0.01"
          placeholder="Cost Price"
          value={form.costPrice}
          onChange={(e) => setForm((f) => ({ ...f, costPrice: Number(e.target.value) }))}
        />
        <input
          className="border px-3 py-2"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
        />
        <button
          className="px-3 py-2 border rounded col-span-6 md:col-span-1"
          // disabled={loading}
          type="submit"
        >
          {editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button
            type="button"
            className="px-3 py-2 border rounded col-span-6 md:col-span-1"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      <SkuTable />
    </div>
  );
}
