import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { supplier } from '~/db/schema/supplier';
import { eq } from 'drizzle-orm';
import { requireUserAuth } from '../../protect-route';
import { handleSuccessResponse } from '../../handle-success-res';
import { handleDataNotFound, handleExpiredSession, handleInvalidRequest } from '../../handle-error-res';
import { createUpdateSchema } from 'drizzle-zod';
import { bodyParse } from '../../body-parse';
import { Params } from '../../params.type';

export async function GET(req: NextRequest, context: Params) {
  const { id } = await context.params;

  return requireUserAuth(req, async (session) => {
    if (session) {
      const [item] = await db.select().from(supplier).where(eq(supplier.id, id)).limit(1);
      return handleSuccessResponse(item);
    }

    return handleExpiredSession();
  });
}

const schema = createUpdateSchema(supplier);

export async function PATCH(req: NextRequest, context: Params) {
  const { id } = await context.params;
  const body = await bodyParse(req);
  const { data, success, error } = schema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      const [result] = await db
        .update(supplier)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(supplier.id, id))
        .returning();

      return handleSuccessResponse(result);
    }

    return handleExpiredSession();
  });
}

export async function DELETE(req: NextRequest, context: Params) {
  const { id } = await context.params;

  return requireUserAuth(req, async (session) => {
    if (session) {
      const result = await db.delete(supplier).where(eq(supplier.id, id)).returning();

      if (!result.length) return handleDataNotFound();

      return handleSuccessResponse(result[0]);
    }

    return handleExpiredSession();
  });
}
