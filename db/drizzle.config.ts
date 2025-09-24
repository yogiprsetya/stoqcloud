/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/*",
  out: "./db/drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL || "",
  },
  verbose: true,
  strict: true,
});
