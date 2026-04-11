-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "oauthProvider" TEXT,
    "oauthId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expansion" (
    "id" TEXT NOT NULL,
    "tcgdexId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "pocketToggle" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "logoUrl" TEXT,
    "cardCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expansion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "tcgdexId" TEXT NOT NULL,
    "expansionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "rarity" TEXT,
    "hp" INTEGER,
    "artist" TEXT,
    "cardNumber" TEXT NOT NULL,
    "totalInSet" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "cachedImagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCollection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "collectionNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualBinder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isChecklist" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualBinder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualBinderCard" (
    "id" TEXT NOT NULL,
    "binderId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualBinderCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupLog" (
    "id" TEXT NOT NULL,
    "backupGroups" TEXT[],
    "backupPath" TEXT NOT NULL,
    "backupSize" BIGINT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "BackupLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "syncType" TEXT NOT NULL,
    "cardsAdded" INTEGER NOT NULL DEFAULT 0,
    "cardsUpdated" INTEGER NOT NULL DEFAULT 0,
    "cardsDeleted" INTEGER NOT NULL DEFAULT 0,
    "imagesDownloaded" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_oauthProvider_oauthId_key" ON "User"("oauthProvider", "oauthId");

-- CreateIndex
CREATE UNIQUE INDEX "Expansion_tcgdexId_key" ON "Expansion"("tcgdexId");

-- CreateIndex
CREATE INDEX "Expansion_tcgdexId_idx" ON "Expansion"("tcgdexId");

-- CreateIndex
CREATE INDEX "Expansion_series_idx" ON "Expansion"("series");

-- CreateIndex
CREATE UNIQUE INDEX "Card_tcgdexId_key" ON "Card"("tcgdexId");

-- CreateIndex
CREATE INDEX "Card_tcgdexId_idx" ON "Card"("tcgdexId");

-- CreateIndex
CREATE INDEX "Card_name_idx" ON "Card"("name");

-- CreateIndex
CREATE INDEX "Card_type_idx" ON "Card"("type");

-- CreateIndex
CREATE INDEX "Card_rarity_idx" ON "Card"("rarity");

-- CreateIndex
CREATE INDEX "Card_artist_idx" ON "Card"("artist");

-- CreateIndex
CREATE INDEX "Card_expansionId_idx" ON "Card"("expansionId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_expansionId_cardNumber_key" ON "Card"("expansionId", "cardNumber");

-- CreateIndex
CREATE INDEX "UserCollection_userId_idx" ON "UserCollection"("userId");

-- CreateIndex
CREATE INDEX "UserCollection_cardId_idx" ON "UserCollection"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCollection_userId_cardId_key" ON "UserCollection"("userId", "cardId");

-- CreateIndex
CREATE INDEX "VirtualBinder_userId_idx" ON "VirtualBinder"("userId");

-- CreateIndex
CREATE INDEX "VirtualBinderCard_binderId_idx" ON "VirtualBinderCard"("binderId");

-- CreateIndex
CREATE INDEX "VirtualBinderCard_cardId_idx" ON "VirtualBinderCard"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualBinderCard_binderId_cardId_key" ON "VirtualBinderCard"("binderId", "cardId");

-- CreateIndex
CREATE INDEX "BackupLog_createdAt_idx" ON "BackupLog"("createdAt");

-- CreateIndex
CREATE INDEX "SyncLog_startedAt_idx" ON "SyncLog"("startedAt");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_expansionId_fkey" FOREIGN KEY ("expansionId") REFERENCES "Expansion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollection" ADD CONSTRAINT "UserCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollection" ADD CONSTRAINT "UserCollection_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualBinder" ADD CONSTRAINT "VirtualBinder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualBinderCard" ADD CONSTRAINT "VirtualBinderCard_binderId_fkey" FOREIGN KEY ("binderId") REFERENCES "VirtualBinder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualBinderCard" ADD CONSTRAINT "VirtualBinderCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
