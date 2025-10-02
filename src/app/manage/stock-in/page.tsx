'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Plus, Download } from 'lucide-react';
import { StockInForm } from './stock-in-form';
import { StockInHistory } from './stock-in-history';
import { useStockInStats } from '~/app/manage/stock-in/use-stock-in';
import { formatRp } from '~/utils/rupiah';

export default function StockInPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Hook untuk statistik
  const { stats, loading: statsLoading, refetch: refetchStats } = useStockInStats();

  const handleRefresh = () => {
    refetchStats(); // Refresh statistik juga
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock In</h1>
          <p className="text-muted-foreground">Manage incoming goods to warehouse</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download />
            Export
          </Button>

          <Button onClick={() => setIsFormOpen(true)}>
            <Plus />
            Stock In
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items Today</CardTitle>
            <Badge variant="secondary">Today</Badge>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.todayItems || 0}</div>
            <p className="text-xs text-muted-foreground">Items received today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Badge variant="secondary">Today</Badge>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : formatRp(stats?.todayValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total value received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
            <Badge variant="outline">Pending</Badge>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.pendingItems || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Badge variant="secondary">Month</Badge>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.monthlyItems || 0}</div>
            <p className="text-xs text-muted-foreground">Total this month</p>
          </CardContent>
        </Card>
      </div>

      <StockInHistory />

      <StockInForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleRefresh} />
    </div>
  );
}
