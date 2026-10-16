// ==========================================================
// Instancia unica (singleton) del cliente de Prisma.
// Evita crear multiples conexiones a la base de datos,
// especialmente relevante con ts-node-dev (hot reload).
// ==========================================================
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma = global.__prisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma__ = prisma;
}
