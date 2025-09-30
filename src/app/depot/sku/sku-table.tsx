import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/common/data-table';
import { useFetchSku } from './use-fetch-sku';
import type { SelectSKU } from './schema';
import { Button } from '~/components/ui/button';
import { formatRp } from '~/utils/rupiah';

interface SkuTableProps {
  onEdit?: (item: SelectSKU) => void;
}

const createColumns = (onEdit?: (item: SelectSKU) => void): ColumnDef<SelectSKU>[] => [
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
    return <div>Loading SKU data...</div>;
  }

  const columns = createColumns(onEdit);

  return <DataTable columns={columns} data={skus ?? []} />;
};
