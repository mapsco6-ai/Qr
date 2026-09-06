import { PrismaClient } from "@prisma/client/wasm";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export async function getPrisma(): Promise<PrismaClient> {
  if (globalThis.__prisma) return globalThis.__prisma;

  const { env } = await getCloudflareContext({ async: true });
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  globalThis.__prisma = prisma;
  return prisma;
}
