import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { loadEnvConfig } from '@next/env';

// Import all schemas
import { users, usersRelations } from './schema/users';
import { sku, skuRelations } from './schema/sku';
import {
  stockTransaction,
  stockTransactionRelations,
  stockTransactionTypeEnum
} from './schema/stock-transaction';

loadEnvConfig(process.cwd());

const client = postgres(process.env.POSTGRES_URL || '', { prepare: false });

const db = drizzle(client, {
  schema: {
    users,
    sku,
    stockTransaction,
    stockTransactionTypeEnum,
    usersRelations,
    skuRelations,
    stockTransactionRelations
  }
});

export { db };
