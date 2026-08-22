import { google } from "googleapis";
import { Readable } from "stream";

function getAuth() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  // Usar o refresh token do dono da conta (que tem os 5TB)
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
}

export function getDriveClient() {
  const auth = getAuth();
  return google.drive({ version: "v3", auth });
}

/**
 * Faz upload de um arquivo para o Google Drive dentro da pasta compartilhada.
 * Retorna a URL pública da imagem.
 */
export async function uploadToDrive(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  subfolder: string
): Promise<string> {
  const drive = getDriveClient();
  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;

  // Procurar ou criar subpasta dentro da pasta raiz
  const folderId = await getOrCreateSubfolder(drive, parentFolderId, subfolder);

  // Converter Buffer para Readable Stream
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  // Fazer upload do arquivo
  const response = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: "id",
  });

  const fileId = response.data.id!;

  // Tornar o arquivo público (qualquer pessoa com o link pode ver)
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // Retornar URL direta da imagem
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

/**
 * Procura uma subpasta pelo nome dentro de uma pasta pai.
 * Se não existir, cria ela.
 */
async function getOrCreateSubfolder(
  drive: ReturnType<typeof google.drive>,
  parentId: string,
  folderName: string
): Promise<string> {
  // Procurar pasta existente
  const search = await drive.files.list({
    q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id)",
  });

  if (search.data.files && search.data.files.length > 0) {
    return search.data.files[0].id!;
  }

  // Criar pasta nova
  const folder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });

  return folder.data.id!;
}
