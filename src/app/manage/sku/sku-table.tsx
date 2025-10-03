import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/common/data-table';
import { useFetchSku } from './use-fetch-sku';
import type { SelectSKU } from './schema';
import { Button } from '~/components/ui/button';
import { formatRp } from '~/utils/rupiah';
import { Pencil, Trash } from 'lucide-react';
import { SearchField } from '~/components/common/search-field';

const MAX_NAME_LENGTH = 30;

interface SkuTableProps {
  onEdit: (item: SelectSKU) => void;
  onDelete: (item: SelectSKU) => void;
  handleOpenModal: () => void;
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
    header: 'Product Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;

      return name.length > MAX_NAME_LENGTH ? (
        <span title={name}>{name.substring(0, MAX_NAME_LENGTH)}...</span>
      ) : (
        name
      );
    }
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

export const SkuTable = ({ onEdit, onDelete, handleOpenModal }: SkuTableProps) => {
  const { skus, meta, isLoading, setPage, setKeyword, keyword } = useFetchSku();

  if (isLoading) {
    return <div>Loading SKU data...</div>;
  }

  const columns = createColumns(onEdit, onDelete);

  const canPrev = (meta?.currentPage ?? 1) > 1;
  const canNext = (meta?.currentPage ?? 1) < (meta?.totalPages ?? 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <SearchField value={keyword} onChange={setKeyword} placeholder="Search ..." />
          <Button onClick={handleOpenModal}>Add SKU</Button>
        </div>
      </div>

      <DataTable columns={columns} data={skus ?? []} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Halaman {meta?.currentPage ?? 1} dari {meta?.totalPages ?? 1} • Total {meta?.totalCount ?? 0}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!canPrev}
            onClick={() => canPrev && setPage(meta!.currentPage - 1)}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            disabled={!canNext}
            onClick={() => canNext && setPage(meta!.currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
