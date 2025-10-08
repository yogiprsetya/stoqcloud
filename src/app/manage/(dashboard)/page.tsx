'use client';

import { FC } from 'react';
import { useAnalyticsDashboard } from './use-analytics-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { formatNumberWithCommas, formatNumberWithSuffix } from '~/utils/format-number';

const AnalyticsDashboard: FC = () => {
  const { data, loading, error } = useAnalyticsDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Total Stock</div>
            <div className="mt-2 text-2xl font-bold">{formatNumberWithCommas(data.totalStock)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Inventory Value</div>
            <div className="mt-2 text-2xl font-bold">Rp. {formatNumberWithSuffix(data.inventoryValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Outbound This Month</div>
            <div className="mt-2 text-2xl font-bold">{data.totalOutboundThisMonth}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Low Stock Items</div>
            <div className="mt-2 text-2xl font-bold">{data.lowStock.length}</div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Outbound (This Month)</CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2">
              {data.mostOutbound.map((item) => (
                <li key={item.skuId} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.skuCode} — {item.name}
                  </span>
                  <span className="font-medium">{item.quantity}</span>
                </li>
              ))}
              {data.mostOutbound.length === 0 && (
                <li className="text-sm text-muted-foreground">No outbound transactions this month</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Low Stock (≤ 10)</CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2">
              {data.lowStock.map((sku) => (
                <li key={sku.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {sku.skuCode} — {sku.name}
                  </span>
                  <span className="font-medium">{sku.stock}</span>
                </li>
              ))}
              {data.lowStock.length === 0 && (
                <li className="text-sm text-muted-foreground">No low stock items</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;
