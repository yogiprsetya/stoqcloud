'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import {
  Eye,
  FileText,
  Calendar,
  Package,
  MoreHorizontal,
  Download,
  Loader2,
  AlertCircle
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
import { useStockInList, StockInTransaction } from '~/app/manage/stock-in/use-stock-in';
import { formatDate } from '~/utils/date';

const StockInDetail = dynamic(
  () => import('./stock-in-detail').then((mod) => ({ default: mod.StockInDetail })),
  {
    ssr: false
  }
);

const MAX_NAME_LENGTH = 30;

interface StockInHistoryProps {
  searchTerm: string;
  onRefresh?: () => void;
}

export function StockInHistory({ searchTerm, onRefresh }: StockInHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Gunakan hook untuk mengambil data dari API
  const { transactions, loading, error, meta, refetch } = useStockInList({
    keyword: searchTerm || undefined,
    page: currentPage,
    sort: 'desc',
    sortBy: 'createdAt'
  });

  // Filter data berdasarkan search term (client-side filtering sebagai backup)
  const filteredData = transactions.filter(
    (item) =>
      item.sku.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.documentNumber && item.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.sku.supplierName && item.sku.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleRefresh = () => {
    refetch();
    onRefresh?.();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Definisi kolom untuk DataTable
  const columns: ColumnDef<StockInTransaction>[] = [
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
        <Badge variant="outline" className="font-mono">
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
      accessorKey: 'sku.supplierName',
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
      accessorKey: 'receivedBy',
      header: 'Diterima Oleh',
      cell: () => <span className="text-sm">-</span>
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
              <Eye className="size-4 mr-2" />
              Lihat Detail
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleDownloadDocument(row.original.id)}>
              <Download className="size-4 mr-2" />
              Download Dokumen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  // Show loading state
  if (loading) {
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
              <Button variant="outline" size="sm" className="ml-4" onClick={handleRefresh}>
                Coba Lagi
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (filteredData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No stock in data</h3>
          <p className="text-muted-foreground text-center">
            {searchTerm
              ? 'No data matches your search.'
              : 'No stock in history yet. Start by adding a new stock in.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Menampilkan {filteredData.length} dari {meta?.totalCount || 0} data
          {meta && ` (Halaman ${meta.currentPage} dari ${meta.totalPages})`}
        </span>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <Download className="size-4 mr-2" />
            Refresh
          </Button>

          <Button variant="outline" size="sm">
            <Download className="size-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredData} />

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
  );
}
