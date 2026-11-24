-- ============================================================
-- COMPLETE SUPABASE SETUP SCRIPT (SCHEMA + DATA)
-- Run this in your Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard/project/rjwlrqvybzxqzjdyaboz
-- 2. Click "SQL Editor" on the left menu
-- 3. Click "+ New query", paste this ENTIRE file, and click "Run" (green button)
-- ============================================================

-- STEP 1: CREATE ENUMS
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "Status" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- STEP 2: CREATE TABLES
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetOtp" TEXT,
    "resetOtpExpiry" TIMESTAMP(3),
    "refreshToken" TEXT,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "allocated" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "purchaseDate" TIMESTAMP(3),
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Employee" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeNo" SERIAL NOT NULL,
    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EmployeeAsset" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "allocatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Query" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "Status" NOT NULL DEFAULT 'OPEN',
    "employeeId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BlacklistedToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlacklistedToken_pkey" PRIMARY KEY ("id")
);

-- STEP 3: CREATE UNIQUE INDEXES
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Product_serialNumber_key" ON "Product"("serialNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Employee_employeeId_key" ON "Employee"("employeeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Employee_email_key" ON "Employee"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Employee_userId_key" ON "Employee"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Employee_employeeNo_key" ON "Employee"("employeeNo");
CREATE UNIQUE INDEX IF NOT EXISTS "BlacklistedToken_token_key" ON "BlacklistedToken"("token");

-- STEP 4: CREATE FOREIGN KEYS
DO $$ BEGIN
  ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EmployeeAsset" ADD CONSTRAINT "EmployeeAsset_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EmployeeAsset" ADD CONSTRAINT "EmployeeAsset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "Query" ADD CONSTRAINT "Query_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "EmployeeAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "Query" ADD CONSTRAINT "Query_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- STEP 5: INSERT ALL YOUR LOCAL DATA

-- Categories
INSERT INTO "Category" ("id", "name") VALUES
  ('0f6dcb4e-a29d-4065-8d83-a2db16bc816b', 'battery'),
  ('4db54551-6980-4edd-96f0-7d85fccee809', 'Electronics')
ON CONFLICT ("id") DO NOTHING;

-- Users
INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt") VALUES
  (3, 'Tejas', 'tejasaher767@gmail.com', '$2b$10$R24ivE8/LDqR8FMSZfDH0ezp9ND8XTFW.AM5WHAo17DTy9rFQDcWi', 'ADMIN', '2026-04-19 18:20:26.237+00'),
  (4, 'Tejas Aher', 'tushar123@gmail.com', '$2b$10$5mSztigd5lVE7h6v3cFrbe1sif8gdRwWxfIIQ0BAx.k2i8/IdEHAa', 'USER', '2026-11-24 16:57:09.324+00')
ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id), 1)) FROM "User";

-- Products
INSERT INTO "Product" ("id", "name", "serialNumber", "categoryId", "quantity", "allocated", "minStock", "purchaseDate", "createdAt", "updatedAt") VALUES
  ('67370608-aec5-41c3-aa7c-430a86493a9a', 'Dell XPS 15', 'SN-XPS-987654', '4db54551-6980-4edd-96f0-7d85fccee809', 10, 2, 2, '2026-03-26 00:00:00+00', '2026-03-26 07:30:22.612+00', '2026-03-26 10:48:28.178+00'),
  ('bd6f4165-6ce6-44c8-9bff-fb18a10c0210', 'er', 'evrv', '0f6dcb4e-a29d-4065-8d83-a2db16bc816b', 5, 1, 4, '2026-03-10 00:00:00+00', '2026-03-13 08:05:40.123+00', '2026-03-26 10:50:23.305+00'),
  ('a2957ce6-4ee0-4287-8437-cd67c7d2085f', 'Lenovo', 'TS-XPS-98765', '4db54551-6980-4edd-96f0-7d85fccee809', 15, 4, 3, '2026-03-26 00:00:00+00', '2026-03-26 07:31:16.320+00', '2026-11-24 17:07:52.496+00')
ON CONFLICT ("id") DO NOTHING;

-- Employees
INSERT INTO "Employee" ("id", "employeeId", "name", "email", "department", "position", "joiningDate", "createdAt", "employeeNo") VALUES
  ('7428ad97-c09a-4da0-9bbb-b124a037153a', 'EMP-006', 'John Doe', 'john.doe@company.com', 'Engineering', 'Software Engineer', '2026-03-26 00:00:00+00', '2026-03-26 06:49:06.132+00', 6),
  ('8e8e89ce-7b5c-44b0-a6d8-a5554ea43148', 'EMP-008', 'Abhishek Jadhav', 'abhi@company.com', 'Engineering', 'Software Engineer', '2026-03-26 00:00:00+00', '2026-03-26 07:08:28.388+00', 8)
ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"Employee"', 'employeeNo'), coalesce(max("employeeNo"), 1)) FROM "Employee";

-- Employee Assets
INSERT INTO "EmployeeAsset" ("id", "employeeId", "productId", "allocatedDate") VALUES
  ('e4987b7a-0127-4cfd-8512-0e476e616625', '7428ad97-c09a-4da0-9bbb-b124a037153a', '67370608-aec5-41c3-aa7c-430a86493a9a', '2026-03-26 07:46:20.734+00'),
  ('d377d9b5-8fc4-4760-b7aa-0c90c4a8bec4', '7428ad97-c09a-4da0-9bbb-b124a037153a', 'a2957ce6-4ee0-4287-8437-cd67c7d2085f', '2026-03-26 07:56:56.832+00'),
  ('d31d9471-7140-4696-a5b8-30e24d2b7f54', '7428ad97-c09a-4da0-9bbb-b124a037153a', 'a2957ce6-4ee0-4287-8437-cd67c7d2085f', '2026-03-26 09:19:25.509+00'),
  ('e3f1ceb0-bfee-472d-a05a-e40edc44d3ee', '7428ad97-c09a-4da0-9bbb-b124a037153a', 'a2957ce6-4ee0-4287-8437-cd67c7d2085f', '2026-03-26 09:37:43.051+00'),
  ('6b5ebbd2-e0b2-41d5-8d4d-a6c18df0cfbc', '7428ad97-c09a-4da0-9bbb-b124a037153a', '67370608-aec5-41c3-aa7c-430a86493a9a', '2026-03-26 10:48:28.143+00'),
  ('a83cd0f9-02b5-4e02-a749-0c8a3fa7cc2c', '7428ad97-c09a-4da0-9bbb-b124a037153a', 'bd6f4165-6ce6-44c8-9bff-fb18a10c0210', '2026-03-26 10:50:23.302+00'),
  ('2930b9ff-f94b-4c4f-9820-b6585fb47b1c', '8e8e89ce-7b5c-44b0-a6d8-a5554ea43148', 'a2957ce6-4ee0-4287-8437-cd67c7d2085f', '2026-11-24 17:07:52.496+00')
ON CONFLICT ("id") DO NOTHING;

-- Queries
INSERT INTO "Query" ("id", "title", "description", "priority", "status", "employeeId", "assetId", "createdAt", "updatedAt") VALUES
  ('fc765c70-b211-438a-a7ab-b4397161a6d8', 'MacBook Screen Broken', 'The screen cracked, I need a monitor to keep working.', 'HIGH', 'CLOSED', '7428ad97-c09a-4da0-9bbb-b124a037153a', 'd31d9471-7140-4696-a5b8-30e24d2b7f54', '2026-03-26 09:59:17.029+00', '2026-11-24 17:07:37.952+00'),
  ('de141b59-a48a-4aef-94d8-ba355ddedfc4', 'MacBook Screen Broken', 'The screen cracked, I need a monitor to keep working.', 'HIGH', 'CLOSED', '7428ad97-c09a-4da0-9bbb-b124a037153a', 'd31d9471-7140-4696-a5b8-30e24d2b7f54', '2026-03-26 09:19:59.111+00', '2026-11-24 17:07:41.226+00')
ON CONFLICT ("id") DO NOTHING;

-- Done!
