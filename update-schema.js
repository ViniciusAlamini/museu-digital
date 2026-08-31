const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

if (!schema.includes('model Comment')) {
  schema = schema.replace(/model Artwork \{([\s\S]*?)\}/, 'model Artwork {$1  comments    Comment[]\n  reactions   Reaction[]\n}');
  schema = schema.replace(/model Message \{([\s\S]*?)\}/, 'model Message {$1  comments    Comment[]\n  reactions   Reaction[]\n}');
  schema = schema.replace(/model Npc \{([\s\S]*?)\}/, 'model Npc {$1  comments    Comment[]\n  reactions   Reaction[]\n}');
  schema = schema.replace(/model DiaryEntry \{([\s\S]*?)\}/, 'model DiaryEntry {$1  comments    Comment[]\n  reactions   Reaction[]\n}');

  const newModels = `
model Comment {
  id          String   @id @default(cuid())
  content     String
  author      String
  createdAt   DateTime @default(now())

  artworkId   String?
  artwork     Artwork? @relation(fields: [artworkId], references: [id], onDelete: Cascade)
  npcId       String?
  npc         Npc?     @relation(fields: [npcId], references: [id], onDelete: Cascade)
  messageId   String?
  message     Message? @relation(fields: [messageId], references: [id], onDelete: Cascade)
  diaryEntryId String?
  diaryEntry  DiaryEntry? @relation(fields: [diaryEntryId], references: [id], onDelete: Cascade)
}

model Reaction {
  id          String   @id @default(cuid())
  emoji       String
  user        String

  artworkId   String?
  artwork     Artwork? @relation(fields: [artworkId], references: [id], onDelete: Cascade)
  npcId       String?
  npc         Npc?     @relation(fields: [npcId], references: [id], onDelete: Cascade)
  messageId   String?
  message     Message? @relation(fields: [messageId], references: [id], onDelete: Cascade)
  diaryEntryId String?
  diaryEntry  DiaryEntry? @relation(fields: [diaryEntryId], references: [id], onDelete: Cascade)
}
`;
  schema += newModels;
  fs.writeFileSync('prisma/schema.prisma', schema);
}
