import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { users } from '~/db/schema/users';
import { createUpdateSchema } from 'drizzle-zod';
import {
  handleExpiredSession,
  handleInvalidRequest,
  handleDataNotFound,
  handleForbidden
} from '~/app/api/handle-error-res';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { bodyParse } from '~/app/api/body-parse';
import { eq } from 'drizzle-orm';
import { requireUserAuth } from '../../protect-route';
import { Params } from '../../params.type';

export async function GET(req: NextRequest, context: Params) {
  const { id } = await context.params;

  return requireUserAuth(req, async (session) => {
    if (session) {
      // Hanya MANAGER yang bisa akses user management
      if (session.user.role !== 'MANAGER') {
        return handleForbidden();
      }

      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          role: users.role,
          emailVerified: users.emailVerified
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        return handleDataNotFound();
      }

      return handleSuccessResponse(user);
    }

    return handleExpiredSession();
  });
}

const updateSchema = createUpdateSchema(users);

export async function PATCH(req: NextRequest, context: Params) {
  const { id } = await context.params;
  const body = await bodyParse(req);
  const { data, success, error } = updateSchema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      // Hanya MANAGER yang bisa update user
      if (session.user.role !== 'MANAGER') {
        return handleForbidden();
      }

      // Cek apakah user ada
      const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1);

      if (!existingUser) {
        return handleDataNotFound();
      }

      const [result] = await db.update(users).set(data).where(eq(users.id, id)).returning();

      return handleSuccessResponse(result);
    }

    return handleExpiredSession();
  });
}

export async function DELETE(req: NextRequest, context: Params) {
  const { id } = await context.params;

  return requireUserAuth(req, async (session) => {
    if (session) {
      // Hanya MANAGER yang bisa delete user
      if (session.user.role !== 'MANAGER') {
        return handleForbidden();
      }

      // Tidak bisa delete diri sendiri
      if (session.user.id === id) {
        return handleForbidden('Cannot delete yourself');
      }

      // Cek apakah user ada
      const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1);

      if (!existingUser) {
        return handleDataNotFound();
      }

      await db.delete(users).where(eq(users.id, id));

      return handleSuccessResponse({ message: 'User deleted successfully' });
    }

    return handleExpiredSession();
  });
}
