import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/common/data-table';
import { useSwrSKU } from './use-swr-sku';
import type { SelectSKU } from './schema';

const columns: ColumnDef<SelectSKU>[] = [
  {
    accessorKey: 'skuCode',
    header: 'Kode SKU'
  },
  {
    accessorKey: 'name',
    header: 'Nama Produk'
  },
  {
    accessorKey: 'category',
    header: 'Kategori'
  },
  {
    accessorKey: 'supplier',
    header: 'Supplier'
  },
  {
    accessorKey: 'costPrice',
    header: 'Harga Beli',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('costPrice'));
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(price);
    }
  },
  {
    accessorKey: 'stock',
    header: 'Stok'
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Dibuat',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleDateString('id-ID');
    }
  }
];

export const SkuTable = () => {
  const { skus, isLoading } = useSwrSKU();

  if (isLoading) {
    return <div>Memuat data SKU...</div>;
  }

  return <DataTable columns={columns} data={skus ?? []} />;
};
