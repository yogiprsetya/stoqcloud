import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/common/data-table';
import { useFetchSku } from './use-fetch-sku';
import type { SelectSKU } from './schema';
import { Button } from '~/components/ui/button';
import { formatRp } from '~/utils/rupiah';
import { Pencil, Trash } from 'lucide-react';

interface SkuTableProps {
  onEdit: (item: SelectSKU) => void;
  onDelete: (item: SelectSKU) => void;
  keyword?: string;
}

const createColumns = (
  onEdit: (item: SelectSKU) => void,
  onDelete: (item: SelectSKU) => void
): ColumnDef<SelectSKU>[] => [
  {
    accessorKey: 'skuCode',
    header: 'SKU Code'
  },
  {
    accessorKey: 'name',
    header: 'Product Name'
  },
  {
    accessorKey: 'category.name',
    header: 'Category'
  },
  {
    accessorKey: 'supplier.name',
    header: 'Supplier'
  },
  {
    accessorKey: 'costPrice',
    header: 'Cost Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('costPrice'));
      return formatRp(price);
    }
  },
  {
    accessorKey: 'stock',
    header: 'Stock'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleDateString('id-ID');
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-1">
        <Button
          variant="outline"
          title={`edit ${row.original.name}`}
          size="icon-sm"
          onClick={() => onEdit(row.original)}
        >
          <Pencil />
        </Button>

        <Button
          variant="destructive"
          title={`delete ${row.original.name}`}
          size="icon-sm"
          onClick={() => onDelete(row.original)}
        >
          <Trash />
        </Button>
      </div>
    )
  }
];

export const SkuTable = ({ onEdit, onDelete, keyword }: SkuTableProps) => {
  const { skus, isLoading } = useFetchSku({ keyword });

  if (isLoading) {
    return <div>Loading SKU data...</div>;
  }

  const columns = createColumns(onEdit, onDelete);

  return <DataTable columns={columns} data={skus ?? []} />;
};
