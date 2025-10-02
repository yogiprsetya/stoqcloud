'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Search, Plus, Download, Filter } from 'lucide-react';
import { StockInForm } from './stock-in-form';
import { StockInHistory } from './stock-in-history';
import { useStockInStats } from '~/app/manage/stock-in/use-stock-in';

export default function StockInPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Hook untuk statistik
  const { stats, loading: statsLoading, refetch: refetchStats } = useStockInStats();

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    refetchStats(); // Refresh statistik juga
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="size-4 mr-2" />
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
              {statsLoading ? '...' : formatCurrency(stats?.todayValue || 0)}
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

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stock In History</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  placeholder="Search by SKU, supplier, or document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="size-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StockInHistory searchTerm={searchTerm} onRefresh={handleRefresh} key={refreshKey} />
        </CardContent>
      </Card>

      {/* Stock In Form Dialog */}
      <StockInForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleRefresh} />
    </div>
  );
}
