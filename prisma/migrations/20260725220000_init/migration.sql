-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');


-- =========================
-- Better Auth tables
-- =========================

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);


-- =========================
-- Application tables
-- =========================

-- CreateTable
CREATE TABLE "Expansion" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "series" TEXT,
    "releaseDate" TIMESTAMP(3),
    "totalCards" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expansion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "expansionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT,
    "rarity" TEXT,
    "supertype" TEXT,
    "hp" INTEGER,
    "types" TEXT[],
    "artist" TEXT,
    "imageUrl" TEXT,
    "imageCachedPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "condition" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Binder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Binder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BinderSlot" (
    "id" TEXT NOT NULL,
    "binderId" TEXT NOT NULL,
    "cardId" TEXT,
    "page" INTEGER NOT NULL DEFAULT 0,
    "slot" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BinderSlot_pkey" PRIMARY KEY ("id")
);


-- =========================
-- Indexes
-- =========================

CREATE UNIQUE INDEX "user_email_key"
ON "user"("email");

CREATE UNIQUE INDEX "session_token_key"
ON "session"("token");

CREATE INDEX "session_userId_idx"
ON "session"("userId");

CREATE INDEX "account_userId_idx"
ON "account"("userId");

CREATE INDEX "verification_identifier_idx"
ON "verification"("identifier");

CREATE UNIQUE INDEX "Expansion_externalId_key"
ON "Expansion"("externalId");

CREATE INDEX "Expansion_name_idx"
ON "Expansion"("name");

CREATE UNIQUE INDEX "Card_externalId_key"
ON "Card"("externalId");

CREATE INDEX "Card_name_idx"
ON "Card"("name");

CREATE INDEX "Card_expansionId_number_idx"
ON "Card"("expansionId", "number");

CREATE INDEX "Card_rarity_idx"
ON "Card"("rarity");

CREATE INDEX "CollectionItem_userId_idx"
ON "CollectionItem"("userId");

CREATE UNIQUE INDEX "CollectionItem_userId_cardId_key"
ON "CollectionItem"("userId", "cardId");

CREATE INDEX "Binder_userId_idx"
ON "Binder"("userId");

CREATE INDEX "BinderSlot_binderId_idx"
ON "BinderSlot"("binderId");

CREATE UNIQUE INDEX "BinderSlot_binderId_page_slot_key"
ON "BinderSlot"("binderId", "page", "slot");


-- =========================
-- Foreign keys
-- =========================

ALTER TABLE "session"
ADD CONSTRAINT "session_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "account"
ADD CONSTRAINT "account_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "Card"
ADD CONSTRAINT "Card_expansionId_fkey"
FOREIGN KEY ("expansionId")
REFERENCES "Expansion"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "CollectionItem"
ADD CONSTRAINT "CollectionItem_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "CollectionItem"
ADD CONSTRAINT "CollectionItem_cardId_fkey"
FOREIGN KEY ("cardId")
REFERENCES "Card"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "Binder"
ADD CONSTRAINT "Binder_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "BinderSlot"
ADD CONSTRAINT "BinderSlot_binderId_fkey"
FOREIGN KEY ("binderId")
REFERENCES "Binder"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "BinderSlot"
ADD CONSTRAINT "BinderSlot_cardId_fkey"
FOREIGN KEY ("cardId")
REFERENCES "Card"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
