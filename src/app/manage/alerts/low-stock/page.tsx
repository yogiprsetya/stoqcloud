'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/common/data-table';
import { SearchField } from '~/components/common/search-field';
import { Pagination } from '~/components/common/pagination';
import { Button } from '~/components/ui/button';
import { ArrowUpDown, RefreshCw, Play } from 'lucide-react';
import { useStockLow } from './use-stock-low';
import { LowStockRow } from '../schema';
import { Input } from '~/components/ui/input';

export default function LowStockAlertsPage() {
  const { data, isLoading, mutate, keyword, sort, threshold, setKeyword, setPage, setSort, setThreshold } =
    useStockLow();

  const columns = useMemo<ColumnDef<LowStockRow>[]>(
    () => [
      {
        accessorKey: 'stock',
        header: () => (
          <Button variant="ghost" size="sm" onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}>
            Stock
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <span className="tabular-nums">{row.original.stock}</span>
      },
      {
        accessorKey: 'skuCode',
        header: 'SKU'
      },
      {
        accessorKey: 'name',
        header: 'Name'
      }
    ],
    [sort]
  );

  const triggerTest = async () => {
    // const query = new URLSearchParams({
    //   keyword,
    //   page: String(page),
    //   sort,
    //   threshold: String(threshold)
    // }).toString();
    // await fetch(`/api/alerts/low-stock/test?${query}`, { method: 'POST' });
    mutate();
  };

  const rows: LowStockRow[] = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Low Stock Alerts</h1>
          <p className="text-muted-foreground">SKU di bawah ambang batas stok</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => mutate()}>
            <RefreshCw /> Refresh
          </Button>

          <Button variant="outline" onClick={triggerTest} title="Run test scan (MANAGER only)">
            <Play /> Test Scan
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <SearchField placeholder="Cari nama SKU..." value={keyword} onChange={(v) => setKeyword(v)} />

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Threshold</label>

          <Input
            type="number"
            min={0}
            className="w-24 border rounded px-2 py-1 text-sm bg-background"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value || 0))}
          />
        </div>
      </div>

      <DataTable columns={columns} data={rows} isLoading={isLoading} />

      <Pagination meta={meta} onPageChange={(p) => setPage(p)} className="mt-4" />
    </div>
  );
}
