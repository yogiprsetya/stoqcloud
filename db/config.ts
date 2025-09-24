import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadEnvConfig } from "@next/env";

// Import all schemas
import { users } from "./schema/users";

loadEnvConfig(process.cwd());

const client = postgres(process.env.POSTGRES_URL || "", { prepare: false });

const db = drizzle(client, {
  schema: {
    users,
  },
});

export { db };
