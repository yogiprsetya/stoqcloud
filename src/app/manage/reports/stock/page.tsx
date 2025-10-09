'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/common/data-table';
import { SearchField } from '~/components/common/search-field';
import { Pagination } from '~/components/common/pagination';
import { Button } from '~/components/ui/button';
import { ArrowUpDown, Download } from 'lucide-react';
import { useReportStock } from './use-report-stock';
import { SelectReportStock } from './schema';
import { formatNumberWithSuffix } from '~/utils/format-number';

const MAX_NAME_LENGTH = 28;
const MAX_SKU_CODE_LENGTH = 8;
const MAX_NAME_SUPPLIER_LENGTH = 14;

export default function StockReportPage() {
  const { data, meta, isLoading, mutate, setSort, setSortBy, setKeyword, setPage, keyword, sort, sortBy } =
    useReportStock();

  const columns = useMemo<ColumnDef<SelectReportStock>[]>(
    () => [
      {
        accessorKey: 'skuCode',
        header: 'SKU',
        cell: ({ row }) => {
          const skuCode = row.original.skuCode;
          return (
            <span className="font-medium" title={skuCode}>
              {skuCode.length > MAX_SKU_CODE_LENGTH
                ? `${skuCode.substring(0, MAX_SKU_CODE_LENGTH)}...`
                : skuCode}
            </span>
          );
        }
      },
      {
        accessorKey: 'name',
        header: () => (
          <Button variant="ghost" size="sm" onClick={() => toggleSort('name')}>
            Name
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const name = row.original.name;
          return name.length > MAX_NAME_LENGTH ? (
            <span title={name}>{name.substring(0, MAX_NAME_LENGTH)}...</span>
          ) : (
            name
          );
        }
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          const categoryName = row.original.category?.name ?? '-';
          return categoryName.length > MAX_NAME_LENGTH ? (
            <span title={categoryName}>{categoryName.substring(0, MAX_NAME_LENGTH)}...</span>
          ) : (
            categoryName
          );
        }
      },
      {
        accessorKey: 'supplier',
        header: 'Supplier',
        cell: ({ row }) => {
          const supplierName = row.original.supplier?.name ?? '-';
          return supplierName.length > MAX_NAME_SUPPLIER_LENGTH ? (
            <span title={supplierName}>{supplierName.substring(0, MAX_NAME_LENGTH)}...</span>
          ) : (
            supplierName
          );
        }
      },
      {
        accessorKey: 'stock',
        header: () => (
          <Button variant="ghost" size="sm" onClick={() => toggleSort('stock')}>
            Stock
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <span className="tabular-nums">{row.original.stock}</span>
      },
      {
        accessorKey: 'costPrice',
        header: 'Cost Price',
        cell: ({ row }) => formatNumberWithSuffix(row.original.costPrice)
      },
      {
        accessorKey: 'inventoryValue',
        header: 'Inventory Value',
        cell: ({ row }) => formatNumberWithSuffix(row.original.inventoryValue)
      }
    ],
    [sort, sortBy]
  );

  const toggleSort = (field: 'name' | 'createdAt' | 'stock') => {
    if (sortBy === field) {
      setSort((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSort('asc');
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Report</h1>
          <p className="text-muted-foreground">Ringkasan stok per SKU beserta nilai persediaan</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => mutate()}>
            Refresh
          </Button>

          <Button variant="outline">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <SearchField placeholder="Cari nama SKU..." value={keyword} onChange={handleSearch} />
      </div>

      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} />
      <Pagination meta={meta} onPageChange={(p) => setPage(p)} className="mt-4" />
    </div>
  );
}
