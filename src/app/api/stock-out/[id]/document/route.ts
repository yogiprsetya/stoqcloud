import { NextRequest, NextResponse } from 'next/server';
import { requireUserAuth } from '../../../protect-route';
import { Params } from '../../../params.type';
import { db } from '~/db/config';
import { stockTransaction } from '~/db/schema/stock-transaction';
import { sku } from '~/db/schema/sku';
import { category } from '~/db/schema/category';
import { supplier } from '~/db/schema/supplier';
import { users } from '~/db/schema/users';
import { and, eq } from 'drizzle-orm';
import { handleExpiredSession, handleNotFound } from '~/app/api/handle-error-res';

export async function GET(req: NextRequest, context: Params) {
  const { id } = context.params;

  return requireUserAuth(req, async (session) => {
    if (session) {
      const result = await db
        .select({
          id: stockTransaction.id,
          type: stockTransaction.type,
          quantity: stockTransaction.quantity,
          unitPrice: stockTransaction.unitPrice,
          totalPrice: stockTransaction.totalPrice,
          documentNumber: stockTransaction.documentNumber,
          notes: stockTransaction.notes,
          createdAt: stockTransaction.createdAt,
          updatedAt: stockTransaction.updatedAt,
          skuCode: sku.skuCode,
          skuName: sku.name,
          categoryName: category.name,
          supplierName: supplier.name,
          createdByName: users.name
        })
        .from(stockTransaction)
        .innerJoin(sku, eq(stockTransaction.skuId, sku.id))
        .leftJoin(category, eq(sku.categoryId, category.id))
        .leftJoin(supplier, eq(sku.supplierId, supplier.id))
        .leftJoin(users, eq(stockTransaction.createdBy, users.id))
        .where(and(eq(stockTransaction.id, id), eq(stockTransaction.type, 'OUT')))
        .limit(1);

      if (!result.length) {
        return handleNotFound();
      }

      const t = result[0];
      const lines = [
        'STOCK OUT DOCUMENT',
        '===================',
        `Document: ${t.documentNumber || '-'}`,
        `SKU: ${t.skuCode} - ${t.skuName}`,
        `Category: ${t.categoryName || '-'}`,
        `Supplier: ${t.supplierName || '-'}`,
        `Quantity: -${t.quantity}`,
        `Unit Price: ${t.unitPrice}`,
        `Total Price: ${t.totalPrice}`,
        `Created At: ${t.createdAt.toISOString()}`,
        `Created By: ${t.createdByName || '-'}`,
        '',
        `Notes: ${t.notes || '-'}`
      ];

      const content = lines.join('\n');
      const filename = `stock-out-${t.documentNumber || t.id}.txt`;

      return NextResponse.json(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }

    return handleExpiredSession();
  });
}
