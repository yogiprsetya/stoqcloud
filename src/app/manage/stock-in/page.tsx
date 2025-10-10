'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Download, BookPlus, Upload } from 'lucide-react';
import { StockInForm } from './stock-in-form';
import { StockInHistory } from './stock-in-history';
import { StockInImportDialog } from './stock-in-import-dialog';
import { useStatStockIn } from '~/app/manage/stock-in/use-stat-stock-in';
import { formatRp } from '~/utils/rupiah';

export default function StockInPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Hook untuk statistik
  const { stats, loading: statsLoading, mutate: refetchStats } = useStatStockIn();

  const handleRefresh = () => {
    refetchStats(); // Refresh statistik juga
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>Stock</span> <Badge variant="success">IN</Badge>
          </h1>

          <p className="text-muted-foreground">Manage incoming goods to warehouse</p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
            <Upload />
            Import
          </Button>
          <Button variant="outline">
            <Download />
            Export
          </Button>

          <Button onClick={() => setIsFormOpen(true)}>
            <BookPlus />
            Stock In
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Items Today</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.todayItems || 0}</div>
            <p className="text-xs text-muted-foreground">Items received today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : formatRp(stats?.todayValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total value received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.pendingItems || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.monthlyItems || 0}</div>
            <p className="text-xs text-muted-foreground">Total this month</p>
          </CardContent>
        </Card>
      </div>

      <StockInHistory />

      <StockInForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleRefresh} />
      <StockInImportDialog isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </div>
  );
}
