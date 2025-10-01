'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Eye, FileText, Calendar, Package, User, MoreHorizontal, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';

interface StockInHistoryProps {
  searchTerm: string;
}

// Mock data - nantinya akan diambil dari API
const mockStockInHistory = [
  {
    id: '1',
    date: '2024-01-15',
    skuCode: 'SKU001',
    skuName: 'Laptop Dell XPS 13',
    quantity: 10,
    documentNumber: 'PO-2024-001',
    supplier: 'PT. Teknologi Indonesia',
    status: 'completed',
    notes: 'Penerimaan barang sesuai PO',
    receivedBy: 'John Doe'
  },
  {
    id: '2',
    date: '2024-01-14',
    skuCode: 'SKU002',
    skuName: 'Mouse Wireless Logitech',
    quantity: 50,
    documentNumber: 'GRN-2024-002',
    supplier: 'CV. Elektronik Jaya',
    status: 'completed',
    notes: '',
    receivedBy: 'Jane Smith'
  },
  {
    id: '3',
    date: '2024-01-13',
    skuCode: 'SKU003',
    skuName: 'Keyboard Mechanical',
    quantity: 25,
    documentNumber: 'PO-2024-003',
    supplier: 'UD. Komputer Mandiri',
    status: 'pending',
    notes: 'Menunggu konfirmasi kualitas',
    receivedBy: 'Bob Johnson'
  }
];

export function StockInHistory({ searchTerm }: StockInHistoryProps) {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  // Filter data berdasarkan search term
  const filteredData = mockStockInHistory.filter(
    (item) =>
      item.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Selesai
          </Badge>
        );
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewDetails = (id: string) => {
    // TODO: Implement view details functionality
    console.log('View details for:', id);
  };

  const handleDownloadDocument = (id: string) => {
    // TODO: Implement download document functionality
    console.log('Download document for:', id);
  };

  if (filteredData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak ada data stock in</h3>
          <p className="text-muted-foreground text-center">
            {searchTerm
              ? 'Tidak ada data yang sesuai dengan pencarian Anda.'
              : 'Belum ada riwayat stock in. Mulai dengan menambahkan stock in baru.'}
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
          Menampilkan {filteredData.length} dari {mockStockInHistory.length} data
        </span>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Dokumen</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Diterima Oleh</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.id}
                className={selectedRow === item.id ? 'bg-muted/50' : ''}
                onMouseEnter={() => setSelectedRow(item.id)}
                onMouseLeave={() => setSelectedRow(null)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(item.date)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{item.skuCode}</div>
                    <div className="text-sm text-muted-foreground">{item.skuName}</div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    +{item.quantity}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{item.documentNumber}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.supplier}</span>
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(item.status)}</TableCell>

                <TableCell>
                  <span className="text-sm">{item.receivedBy}</span>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(item.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadDocument(item.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Dokumen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination would go here */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Halaman 1 dari 1</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Sebelumnya
          </Button>
          <Button variant="outline" size="sm" disabled>
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
