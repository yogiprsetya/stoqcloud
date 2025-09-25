CREATE TYPE "public"."role" AS ENUM('MANAGER', 'OPERATOR');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'OPERATOR' NOT NULL;