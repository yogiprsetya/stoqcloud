import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { users } from '~/db/schema/users';
import { createInsertSchema } from 'drizzle-zod';
import { handleExpiredSession, handleForbidden, handleInvalidRequest } from '~/app/api/handle-error-res';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { bodyParse } from '~/app/api/body-parse';
import { and, asc, desc, ilike } from 'drizzle-orm';
import { requireUserAuth } from '../protect-route';
import { createMeta } from '../create-meta';
import { LIMIT_DB_ROW } from '~/config/constant';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    keyword: searchParams.get('keyword'),
    page: searchParams.get('page'),
    sort: searchParams.get('sort'), // asc | desc
    sortBy: searchParams.get('sortBy') // name
  };

  let sortedBy = desc(users.name);

  const searchCondition = params.keyword ? ilike(users.name, `%${params.keyword}%`) : undefined;
  const offset = params.page ? (Number(params.page) - 1) * LIMIT_DB_ROW : 0;
  const queryFilter = and(searchCondition);
  const sort = params.sort || 'asc';
  const sortBy = params.sortBy || 'name';

  if (sort === 'asc') {
    sortedBy = sortBy === 'name' ? asc(users.name) : asc(users.name);
  }

  if (sort === 'desc') {
    sortedBy = sortBy === 'name' ? desc(users.name) : desc(users.name);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      // Hanya MANAGER yang bisa akses user management
      if (session.user.role !== 'MANAGER') {
        return handleForbidden();
      }

      const items = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          role: users.role,
          emailVerified: users.emailVerified
        })
        .from(users)
        .where(queryFilter)
        .orderBy(sortedBy)
        .offset(offset)
        .limit(LIMIT_DB_ROW);

      const meta = await createMeta({
        table: users,
        page: Number(params.page || 1),
        query: queryFilter
      });

      return handleSuccessResponse(items, meta);
    }

    return handleExpiredSession();
  });
}

const schema = createInsertSchema(users);

export async function POST(req: NextRequest) {
  const body = await bodyParse(req);
  const { data, success, error } = schema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      // Hanya MANAGER yang bisa create user
      if (session.user.role !== 'MANAGER') {
        return handleForbidden();
      }

      const [result] = await db.insert(users).values(data).returning();

      return handleSuccessResponse(result);
    }

    return handleExpiredSession();
  });
}
