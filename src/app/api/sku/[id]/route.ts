import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { sku } from '~/db/schema/sku';
import { handleDataNotFound, handleExpiredSession, handleInvalidRequest } from '~/app/api/handle-error-res';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { bodyParse } from '~/app/api/body-parse';
import { eq } from 'drizzle-orm';
import { requireUserAuth } from '../../protect-route';
import { createUpdateSchema } from 'drizzle-zod';

const schema = createUpdateSchema(sku);

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: Params) {
  const { id } = await context.params;

  return requireUserAuth(req, async (session) => {
    if (session) {
      const [item] = await db.select().from(sku).where(eq(sku.id, id)).limit(1);
      return handleSuccessResponse(item);
    }

    return handleExpiredSession();
  });
}

export async function PATCH(req: NextRequest, context: Params) {
  const { id } = await context.params;
  const body = await bodyParse(req);
  const { data, success, error } = schema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      const updatedInventory = await db
        .update(sku)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(sku.id, id))
        .returning();

      return handleSuccessResponse(updatedInventory[0]);
    }

    return handleExpiredSession();
  });
}

export async function DELETE(req: NextRequest, context: Params) {
  const { id } = await context.params;

  return requireUserAuth(req, async (session) => {
    if (session) {
      const result = await db.delete(sku).where(eq(sku.id, id)).returning();

      if (!result.length) return handleDataNotFound();

      return handleSuccessResponse(result[0]);
    }

    return handleExpiredSession();
  });
}
