import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

// A chave secreta usada para criptografar o cookie. Em produção, use uma variável de ambiente forte.
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secret_key_museu_rpg_2026_fallback"
);

export type Role = "visitor" | "player" | "admin";

/**
 * Cria um token JWT assinado para o usuário.
 */
export async function signToken(role: Role): Promise<string> {
  return await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

/**
 * Lê e valida um token JWT. Se inválido, retorna 'visitor'.
 */
export async function verifyToken(token: string | undefined): Promise<Role> {
  if (!token) return "visitor";
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return (payload.role as Role) || "visitor";
  } catch (error) {
    return "visitor";
  }
}

/**
 * Lê o cookie de sessão da requisição atual e retorna o nível de acesso.
 */
export async function getSessionRole(): Promise<Role> {
  const cookieStore = await cookies();
  const token = cookieStore.get("museu_auth")?.value;
  return await verifyToken(token);
}

/**
 * Validador para Server Actions. Dispara um erro se o usuário não tiver o cargo mínimo.
 */
export async function requireAuth(minimumRole: "player" | "admin" = "player"): Promise<Role> {
  const role = await getSessionRole();
  
  if (role === "visitor") {
    throw new Error("Não autorizado. Faça login para realizar esta ação.");
  }

  if (minimumRole === "admin" && role !== "admin") {
    throw new Error("Permissão de Mestre/Administrador necessária para esta ação.");
  }

  return role;
}
