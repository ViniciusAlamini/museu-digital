import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secret_key_museu_rpg_2026_fallback"
);

export type Role = "visitor" | "player" | "admin";

export type SessionPayload = {
  role: Role;
  username?: string;
};

/**
 * Cria um token JWT assinado para o usuário.
 */
export async function signToken(role: Role, username?: string): Promise<string> {
  return await new SignJWT({ role, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

/**
 * Lê e valida um token JWT. Se inválido, retorna 'visitor'.
 */
export async function verifyToken(token: string | undefined): Promise<SessionPayload> {
  if (!token) return { role: "visitor" };
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { 
      role: (payload.role as Role) || "visitor",
      username: payload.username as string | undefined,
    };
  } catch (error) {
    return { role: "visitor" };
  }
}

/**
 * Lê o cookie de sessão da requisição atual e retorna os dados.
 */
export async function getSession(): Promise<SessionPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get("museu_auth")?.value;
  return await verifyToken(token);
}

export async function getSessionRole(): Promise<Role> {
  const { role } = await getSession();
  return role;
}

/**
 * Validador para Server Actions.
 */
export async function requireAuth(minimumRole: "player" | "admin" = "player"): Promise<SessionPayload> {
  const session = await getSession();
  
  if (session.role === "visitor") {
    throw new Error("Não autorizado. Faça login para realizar esta ação.");
  }

  if (minimumRole === "admin" && session.role !== "admin") {
    throw new Error("Permissão de Mestre/Administrador necessária para esta ação.");
  }

  return session;
}
