import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { stockTransaction } from '~/db/schema/stock-transaction';
import { sku } from '~/db/schema/sku';
import { category } from '~/db/schema/category';
import { supplier } from '~/db/schema/supplier';
import { users } from '~/db/schema/users';
import { createUpdateSchema } from 'drizzle-zod';
import { handleDataNotFound, handleExpiredSession, handleInvalidRequest } from '~/app/api/handle-error-res';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { bodyParse } from '~/app/api/body-parse';
import { eq, sql, and } from 'drizzle-orm';
import { requireUserAuth } from '../../protect-route';
import { Params } from '../../params.type';

export async function GET(req: NextRequest, context: Params) {
  const { id } = context.params;

  return requireUserAuth(req, async (session) => {
    if (session) {
      // Single optimized query with only necessary fields
      const result = await db
        .select({
          id: stockTransaction.id,
          skuId: stockTransaction.skuId,
          type: stockTransaction.type,
          quantity: stockTransaction.quantity,
          unitPrice: stockTransaction.unitPrice,
          totalPrice: stockTransaction.totalPrice,
          documentNumber: stockTransaction.documentNumber,
          notes: stockTransaction.notes,
          createdBy: stockTransaction.createdBy,
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
        .where(and(eq(stockTransaction.id, id), eq(stockTransaction.type, 'OUT'))) // Hanya stock-out
        .limit(1);

      if (!result.length) {
        return handleInvalidRequest('Stock-out transaction not found');
      }

      const { skuCode, skuName, categoryName, supplierName, createdByName, ...transactionData } = result[0];

      const transaction = {
        ...transactionData,
        sku: {
          id: result[0].skuId,
          skuCode,
          name: skuName,
          categoryName,
          supplierName
        },
        createdByUser: transactionData.createdBy
          ? {
              id: transactionData.createdBy,
              name: createdByName
            }
          : null
      };

      return handleSuccessResponse(transaction);
    }

    return handleExpiredSession();
  });
}

const updateStockOutTransactionSchema = createUpdateSchema(stockTransaction).omit({
  type: true
});

export async function PATCH(req: NextRequest, context: Params) {
  const { id } = context.params;
  const body = await bodyParse(req);
  const { data, success, error } = updateStockOutTransactionSchema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      try {
        const result = await db.transaction(async (tx) => {
          const [existing] = await tx
            .select({
              id: stockTransaction.id,
              type: stockTransaction.type,
              quantity: stockTransaction.quantity,
              skuId: stockTransaction.skuId
            })
            .from(stockTransaction)
            .where(and(eq(stockTransaction.id, id), eq(stockTransaction.type, 'OUT'))) // Hanya stock-out
            .limit(1);

          if (!existing) {
            return handleInvalidRequest('Stock-out transaction not found');
          }

          const updateData: Record<string, Date | string | number | null> = { updatedAt: new Date() };

          if (data.quantity !== undefined) updateData.quantity = data.quantity;
          if (data.unitPrice !== undefined) updateData.unitPrice = data.unitPrice.toString();
          if (data.totalPrice !== undefined) updateData.totalPrice = data.totalPrice.toString();
          if (data.documentNumber !== undefined) updateData.documentNumber = data.documentNumber;
          if (data.notes !== undefined) updateData.notes = data.notes;

          const quantityDifference = data.quantity !== undefined ? data.quantity - existing.quantity : 0;

          if (quantityDifference > 0) {
            const [currentSku] = await tx
              .select({ stock: sku.stock })
              .from(sku)
              .where(eq(sku.id, existing.skuId))
              .limit(1);

            if (!currentSku) {
              return handleDataNotFound();
            }

            if (currentSku.stock < quantityDifference) {
              return handleInvalidRequest(
                `Insufficient stock. Available: ${currentSku.stock}, Additional needed: ${quantityDifference}`
              );
            }
          }

          const [updatedTransaction] = await tx
            .update(stockTransaction)
            .set(updateData)
            .where(eq(stockTransaction.id, id))
            .returning();

          // Update SKU stock if quantity changed (untuk stock-out, kurangi stock)
          if (quantityDifference !== 0) {
            await tx
              .update(sku)
              .set({
                stock: sql`${sku.stock} - ${quantityDifference}`,
                updatedAt: new Date()
              })
              .where(eq(sku.id, existing.skuId));
          }

          return updatedTransaction;
        });

        return handleSuccessResponse(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error updating stock-out transaction';
        return handleInvalidRequest(message);
      }
    }

    return handleExpiredSession();
  });
}

export async function DELETE(req: NextRequest, context: Params) {
  const { id } = context.params;

  return requireUserAuth(req, async (session) => {
    if (session) {
      try {
        // Single optimized transaction
        const result = await db.transaction(async (tx) => {
          // Get minimal data needed for validation and stock update
          const [existing] = await tx
            .select({
              id: stockTransaction.id,
              type: stockTransaction.type,
              quantity: stockTransaction.quantity,
              skuId: stockTransaction.skuId
            })
            .from(stockTransaction)
            .where(and(eq(stockTransaction.id, id), eq(stockTransaction.type, 'OUT'))) // Hanya stock-out
            .limit(1);

          if (!existing) {
            return handleInvalidRequest('Stock-out transaction not found');
          }

          // Delete stock transaction
          const [deletedTransaction] = await tx
            .delete(stockTransaction)
            .where(eq(stockTransaction.id, id))
            .returning();

          // Update SKU stock - tambah stock karena stock-out dihapus
          await tx
            .update(sku)
            .set({
              stock: sql`${sku.stock} + ${existing.quantity}`,
              updatedAt: new Date()
            })
            .where(eq(sku.id, existing.skuId));

          return deletedTransaction;
        });

        return handleSuccessResponse(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error deleting stock-out';
        return handleInvalidRequest(message);
      }
    }

    return handleExpiredSession();
  });
}
