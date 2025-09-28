-- Step 1: Create the new tables first
CREATE TABLE "category" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(100) NOT NULL,
  "description" varchar(255),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "category_name_unique" UNIQUE("name")
);

CREATE TABLE "supplier" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(255) NOT NULL,
  "contact_person" varchar(100),
  "email" varchar(255),
  "phone" varchar(20),
  "address" varchar(500),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "supplier_name_unique" UNIQUE("name")
);

-- Step 2: If you have existing category/supplier data, migrate it
-- (Skip this if starting fresh)
-- INSERT INTO "category" ("name", "description") 
-- SELECT DISTINCT category_name, category_description FROM your_existing_data;

-- INSERT INTO "supplier" ("name", "contact_person", "email", "phone", "address") 
-- SELECT DISTINCT supplier_name, contact_person, email, phone, address FROM your_existing_data;

-- Step 3: Add temporary columns to SKU table
ALTER TABLE "sku" ADD COLUMN "category_id_new" uuid;
ALTER TABLE "sku" ADD COLUMN "supplier_id_new" uuid;

-- Step 4: Update the new columns with UUID references
-- Match existing category names/IDs with new UUID categories
UPDATE "sku" 
SET "category_id_new" = c.id 
FROM "category" c 
WHERE c.name = "sku".category_name; -- Adjust this condition based on your current data structure

UPDATE "sku" 
SET "supplier_id_new" = s.id 
FROM "supplier" s 
WHERE s.name = "sku".supplier_name; -- Adjust this condition based on your current data structure

-- Step 5: Drop old columns and constraints
ALTER TABLE "sku" DROP CONSTRAINT IF EXISTS "sku_created_by_user_id_fk";
ALTER TABLE "sku" DROP COLUMN IF EXISTS "created_by";
ALTER TABLE "sku" DROP COLUMN IF EXISTS "category";
ALTER TABLE "sku" DROP COLUMN IF EXISTS "supplier";

-- Step 6: Rename new columns
ALTER TABLE "sku" RENAME COLUMN "category_id_new" TO "category_id";
ALTER TABLE "sku" RENAME COLUMN "supplier_id_new" TO "supplier_id";

-- Step 7: Add foreign key constraints
ALTER TABLE "sku" ADD CONSTRAINT "sku_category_id_category_id_fk" 
  FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE "sku" ADD CONSTRAINT "sku_supplier_id_supplier_id_fk" 
  FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION;