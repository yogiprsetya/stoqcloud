import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/common/data-table';
import { useFetchSku } from './use-fetch-sku';
import type { SelectSKU } from './schema';
import { Button } from '~/components/ui/button';

interface SkuTableProps {
  onEdit?: (item: SelectSKU) => void;
}

const createColumns = (onEdit?: (item: SelectSKU) => void): ColumnDef<SelectSKU>[] => [
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
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => {
      const sku = row.original;
      return (
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(sku)}>
              Edit
            </Button>
          )}
        </div>
      );
    }
  }
];

export const SkuTable = ({ onEdit }: SkuTableProps) => {
  const { skus, isLoading } = useFetchSku();

  if (isLoading) {
    return <div>Memuat data SKU...</div>;
  }

  const columns = createColumns(onEdit);

  return <DataTable columns={columns} data={skus ?? []} />;
};
