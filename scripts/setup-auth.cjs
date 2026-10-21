const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const root = path.resolve(__dirname, "..");
const databasePath = path.join(root, "prisma", "dev.db");
if (!fs.existsSync(databasePath)) {
  throw new Error("Banco ausente. Execute npm run db:migrate antes deste comando.");
}

const envPath = path.join(root, ".env.local");
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, `AUTH_SECRET=${crypto.randomBytes(48).toString("base64url")}\n`, { flag: "wx" });
}

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");
db.transaction(() => {
  const tables = new Set(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((row) => row.name));
  if (!tables.has("Campaign")) throw new Error("Tabela Campaign ausente. Execute npm run db:migrate antes deste comando.");
  if (!tables.has("User")) {
    db.exec(`CREATE TABLE "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "username" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "role" TEXT NOT NULL DEFAULT 'MEMBER'
    )`);
  } else {
    const columns = new Set(db.prepare('PRAGMA table_info("User")').all().map((column) => column.name));
    if (!columns.has("role")) db.exec('ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT \'MEMBER\'');
  }
  if (!tables.has("AuditLog")) {
    db.exec(`CREATE TABLE "AuditLog" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "campaignId" TEXT NOT NULL,
      "user" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "entityType" TEXT NOT NULL,
      "entityName" TEXT NOT NULL,
      "details" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);
    db.exec('CREATE INDEX "AuditLog_campaignId_createdAt_idx" ON "AuditLog" ("campaignId", "createdAt")');
  }
})();
db.close();
console.log("Login, cadastro e auditoria prontos. Contas e registros existentes foram preservados.");
