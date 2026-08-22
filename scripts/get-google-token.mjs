/**
 * Script auxiliar para gerar o Refresh Token do Google Drive.
 * Rode este script UMA VEZ no seu computador para obter o token.
 * 
 * Como usar:
 *   1. Preencha o GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env
 *   2. Rode: node --env-file=.env scripts/get-google-token.mjs
 *   3. O navegador abre sozinho, faça login e autorize
 *   4. Copie o refresh_token que aparece no terminal e cole no .env
 */

import { google } from "googleapis";
import http from "http";
import { URL } from "url";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_PORT = 3333;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ Preencha GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no arquivo .env primeiro!");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/drive.file"],
  prompt: "consent",
});

console.log("");
console.log("====================================================");
console.log("  🔐 Gerador de Refresh Token para o Google Drive");
console.log("====================================================");
console.log("");
console.log("Abrindo o navegador para você fazer login...");
console.log("Se não abrir sozinho, copie e cole este link:");
console.log("");
console.log(`   ${authUrl}`);
console.log("");

// Tentar abrir o navegador automaticamente
import("child_process").then(({ exec }) => {
  const cmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
  exec(`${cmd} "${authUrl}"`);
});

// Criar mini servidor local para pegar o código de autorização
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);
    const code = url.searchParams.get("code");

    if (!code) {
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>❌ Erro: código não encontrado</h1>");
      return;
    }

    const { tokens } = await oauth2Client.getToken(code);

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <html><body style="font-family: sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: #eee;">
        <h1 style="color: #7c3aed;">✅ Autorizado com sucesso!</h1>
        <p>Volte para o terminal do seu computador para copiar o token.</p>
        <p>Pode fechar esta aba.</p>
      </body></html>
    `);

    console.log("");
    console.log("✅ Sucesso! Aqui está o seu Refresh Token:");
    console.log("");
    console.log("─────────────────────────────────────────────");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log("─────────────────────────────────────────────");
    console.log("");
    console.log("👆 Copie a linha acima e cole no seu arquivo .env");
    console.log("");

    server.close();
    process.exit(0);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>❌ Erro ao obter token</h1>");
    console.error("❌ Erro:", error);
    server.close();
    process.exit(1);
  }
});

server.listen(REDIRECT_PORT, () => {
  console.log(`Aguardando autorização na porta ${REDIRECT_PORT}...`);
});
