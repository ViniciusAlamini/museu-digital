-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN "addedBy" TEXT;
ALTER TABLE "Artwork" ADD COLUMN "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "ArtworkFolder" ADD COLUMN "addedBy" TEXT;
ALTER TABLE "ArtworkFolder" ADD COLUMN "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN "addedBy" TEXT;
ALTER TABLE "Campaign" ADD COLUMN "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Character" ADD COLUMN "addedBy" TEXT;
ALTER TABLE "Character" ADD COLUMN "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "DiaryEntry" ADD COLUMN "addedBy" TEXT;
ALTER TABLE "DiaryEntry" ADD COLUMN "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "DiaryFolder" ADD COLUMN "addedBy" TEXT;
ALTER TABLE "DiaryFolder" ADD COLUMN "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN "addedBy" TEXT;
ALTER TABLE "Message" ADD COLUMN "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "addedBy" TEXT;
ALTER TABLE "Post" ADD COLUMN "updatedBy" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
