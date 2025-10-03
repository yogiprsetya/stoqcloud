'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Eye, FileText, Calendar, MoreHorizontal, Download, Filter } from 'lucide-react';
import { Pagination } from '~/components/common/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import dynamic from 'next/dynamic';
import { DataTable } from '~/components/common/data-table';
import { useFetchStockOut } from '~/app/manage/stock-out/use-fetch-stock-out';
import { formatDate } from '~/utils/date';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { SelectStockTransaction } from './schema';
import { SearchField } from '~/components/common/search-field';

const StockOutDetail = dynamic(
  () => import('./stock-out-detail').then((mod) => ({ default: mod.StockOutDetail })),
  {
    ssr: false
  }
);

const MAX_NAME_LENGTH = 36;

export const StockOutHistory = () => {
  const [detailId, setDetailId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { transactions, meta, setPage, setKeyword, keyword, isLoading } = useFetchStockOut();

  const handleViewDetails = (id: string) => {
    setDetailId(id);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setDetailId(null);
  };

  const handleDownloadDocument = (id: string) => {
    // TODO: Implement download document functionality
    console.log('Download document for:', id);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Definisi kolom untuk DataTable
  const columns: ColumnDef<SelectStockTransaction>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Tanggal',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          {formatDate(row.original.createdAt)}
        </div>
      )
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => (
        <div title={row.original.sku.name}>
          <div className="font-medium">{row.original.sku.skuCode}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.sku.name.length > MAX_NAME_LENGTH
              ? row.original.sku.name.slice(0, MAX_NAME_LENGTH) + '...'
              : row.original.sku.name}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => (
        <Badge variant="destructive" size="sm">
          -{row.original.quantity}
        </Badge>
      )
    },
    {
      accessorKey: 'documentNumber',
      header: 'Dokumen',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <span className="font-mono text-sm">{row.original.documentNumber || '-'}</span>
        </div>
      )
    },
    {
      accessorKey: 'supplier.name',
      header: 'Supplier'
    },
    {
      accessorKey: 'createdBy.name',
      header: 'Created By',
      cell: ({ row }) => row.original.createdBy?.name || '-'
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDetails(row.original.id)}>
              <Eye />
              Lihat Detail
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleDownloadDocument(row.original.id)}>
              <Download />
              Download Dokumen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Stock Out History</CardTitle>

          <div className="flex gap-2">
            <SearchField
              value={keyword}
              onChange={(value) => setKeyword(value)}
              placeholder="Search by SKU, supplier, or document..."
            />

            <Button variant="outline" size="sm">
              <Filter />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Menampilkan {transactions?.length || 0} dari {meta?.totalCount || 0} data
              {meta && ` (Halaman ${meta.currentPage} dari ${meta.totalPages})`}
            </span>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download />
                Export Data
              </Button>
            </div>
          </div>

          <DataTable columns={columns} isLoading={isLoading} data={transactions || []} />

          <Pagination meta={meta} onPageChange={handlePageChange} showInfo={false} />

          {/* Detail Dialog */}
          <StockOutDetail isOpen={isDetailOpen} onClose={handleCloseDetail} transactionId={detailId} />
        </div>
      </CardContent>
    </Card>
  );
};
