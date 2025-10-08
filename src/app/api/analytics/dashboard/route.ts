import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { sku } from '~/db/schema/sku';
import { stockTransaction } from '~/db/schema/stock-transaction';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { handleExpiredSession } from '~/app/api/handle-error-res';
import { requireUserAuth } from '~/app/api/protect-route';
import { and, eq, inArray, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  return requireUserAuth(req, async (session) => {
    if (session) {
      // Define useful time ranges
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Queries in parallel for performance
      const [totalStockRow, lowStockRows, mostOutboundRows, inventoryValueRow, monthOutboundRow] =
        await Promise.all([
          // Total stock across all SKUs
          db.select({ totalStock: sql<number>`coalesce(sum(${sku.stock}), 0)` }).from(sku),

          // Low stock SKUs (threshold=10)
          db
            .select({ id: sku.id, name: sku.name, skuCode: sku.skuCode, stock: sku.stock })
            .from(sku)
            .where(sql`${sku.stock} <= 10`)
            .limit(10),

          // Most outbound items (top 5 by quantity) this month
          db
            .select({
              skuId: stockTransaction.skuId,
              quantity: sql<number>`coalesce(sum(${stockTransaction.quantity}), 0)`
            })
            .from(stockTransaction)
            .where(
              and(
                eq(stockTransaction.type, 'OUT'),
                sql`${stockTransaction.createdAt} >= ${startOfMonth.toISOString()}::timestamp`
              )
            )
            .groupBy(stockTransaction.skuId)
            .orderBy(sql`2 desc`)
            .limit(5),

          // Inventory value (sum of costPrice * stock)
          db
            .select({
              value: sql<number>`coalesce(sum(${sku.costPrice}::numeric * ${sku.stock}), 0)`
            })
            .from(sku),

          // Total outbound quantity this month (for quick card)
          db
            .select({
              totalOutbound: sql<number>`coalesce(sum(${stockTransaction.quantity}), 0)`
            })
            .from(stockTransaction)
            .where(
              and(
                eq(stockTransaction.type, 'OUT'),
                sql`${stockTransaction.createdAt} >= ${startOfMonth.toISOString()}::timestamp`
              )
            )
        ]);

      const totalStock = totalStockRow?.[0]?.totalStock || 0;
      const inventoryValue = inventoryValueRow?.[0]?.value || 0;
      const totalOutboundThisMonth = monthOutboundRow?.[0]?.totalOutbound || 0;

      // Enrich most outbound with SKU basic info
      const mostOutboundSkuIds = mostOutboundRows.map((r) => r.skuId);
      let mostOutbound: Array<{ skuId: string; skuCode: string; name: string; quantity: number }> = [];

      if (mostOutboundSkuIds.length > 0) {
        const skuRows = await db
          .select({ id: sku.id, skuCode: sku.skuCode, name: sku.name })
          .from(sku)
          .where(inArray(sku.id, mostOutboundSkuIds));

        const skuMap = new Map(skuRows.map((s) => [s.id, s]));

        mostOutbound = mostOutboundRows.map((r) => ({
          skuId: r.skuId,
          skuCode: skuMap.get(r.skuId)?.skuCode || '',
          name: skuMap.get(r.skuId)?.name || '',
          quantity: r.quantity
        }));
      }

      return handleSuccessResponse({
        totalStock,
        lowStock: lowStockRows,
        mostOutbound,
        inventoryValue,
        totalOutboundThisMonth
      });
    }

    return handleExpiredSession();
  });
}
