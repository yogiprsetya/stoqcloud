import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { loadEnvConfig } from '@next/env';

// Import all schemas
import { users, usersRelations } from './schema/users';
import { sku, skuRelations } from './schema/sku';

loadEnvConfig(process.cwd());

const client = postgres(process.env.POSTGRES_URL || '', { prepare: false });

const db = drizzle(client, {
  schema: {
    users,
    sku,
    usersRelations,
    skuRelations
  }
});

export { db };
