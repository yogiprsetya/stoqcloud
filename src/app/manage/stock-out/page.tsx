'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { BookUp2, Upload } from 'lucide-react';
import { StockOutForm } from './stock-out-form';
import { StockOutHistory } from './stock-out-history';
import { useStatStockOut } from '~/app/manage/stock-out/use-stat-stock-out';
import { formatRp } from '~/utils/rupiah';

export default function StockOutPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Hook untuk statistik
  const { stats, loading: statsLoading, mutate: refetchStats } = useStatStockOut();

  const handleRefresh = () => {
    refetchStats(); // Refresh statistik juga
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>Stock</span>
            <Badge variant="destructive">OUT</Badge>
          </h1>
          <p className="text-muted-foreground">Manage outgoing goods from warehouse</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Upload />
            Export
          </Button>

          <Button onClick={() => setIsFormOpen(true)}>
            <BookUp2 />
            Stock Out
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Today Items</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.todayItems || 0}</div>
            <p className="text-xs text-muted-foreground">Items out today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Today Value</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : formatRp(stats?.todayValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total value today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Items</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.monthlyItems || 0}</div>
            <p className="text-xs text-muted-foreground">Items this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.pendingItems || 0}</div>
            <p className="text-xs text-muted-foreground">Pending transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* History Section */}
      <StockOutHistory />

      {/* Form Dialog */}
      <StockOutForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleRefresh} />
    </div>
  );
}
