import { type SQL, sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { db } from '~/db/config';

type CreateMetaParams = {
  table: PgTable;
  query: SQL | undefined;
  limit: number;
  page: number;
};

export const createMeta = async (param: CreateMetaParams) => {
  const totalCountResult = await db
    .select({ count: sql`COUNT(*)` })
    .from(param.table)
    .where(param.query);

  const totalCount = Number(totalCountResult[0]?.count ?? 0);
  const totalPages = Math.ceil(totalCount / param.limit);
  const currentPage = param.page ?? 1;

  return {
    totalCount,
    totalPages,
    currentPage,
    limit: param.limit
  };
};
