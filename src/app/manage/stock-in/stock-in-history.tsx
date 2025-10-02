'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Eye,
  FileText,
  Calendar,
  Package,
  MoreHorizontal,
  Download,
  Loader2,
  AlertCircle,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '~/components/ui/alert';
import dynamic from 'next/dynamic';
import { DataTable } from '~/components/common/data-table';
import { useFetchStockIn } from '~/app/manage/stock-in/use-fetch-stock-in';
import { formatDate } from '~/utils/date';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { SelectStockTransaction } from './schema';
import { SearchField } from '~/components/common/search-field';

const StockInDetail = dynamic(
  () => import('./stock-in-detail').then((mod) => ({ default: mod.StockInDetail })),
  {
    ssr: false
  }
);

const MAX_NAME_LENGTH = 30;

export const StockInHistory = () => {
  const [detailId, setDetailId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Gunakan hook untuk mengambil data dari API
  const { transactions, isLoading, error, meta, setPage, setKeyword, keyword } = useFetchStockIn();

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
        <Badge variant="outline" size="sm">
          +{row.original.quantity}
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
      accessorKey: 'type',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.type === 'IN' ? 'default' : 'destructive'}>{row.original.type}</Badge>
      )
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

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Memuat data...</h3>
          <p className="text-muted-foreground text-center">Sedang mengambil data stock in dari server.</p>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <Alert variant="destructive">
            <AlertCircle className="size-4" />

            <AlertDescription>
              <strong>Error:</strong> {error}
              <Button variant="outline" size="sm" className="ml-4">
                Coba Lagi
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No stock in data</h3>
          <p className="text-muted-foreground text-center">
            {keyword
              ? 'No data matches your search.'
              : 'No stock in history yet. Start by adding a new stock in.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Stock In History</CardTitle>

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

          {/* Data Table */}
          <DataTable columns={columns} data={transactions || []} />

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Halaman {meta.currentPage} dari {meta.totalPages}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.currentPage <= 1}
                  onClick={() => handlePageChange(meta.currentPage - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.currentPage >= meta.totalPages}
                  onClick={() => handlePageChange(meta.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Detail Dialog */}
          <StockInDetail isOpen={isDetailOpen} onClose={handleCloseDetail} transactionId={detailId} />
        </div>
      </CardContent>
    </Card>
  );
};
