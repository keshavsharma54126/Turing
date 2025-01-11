import { PrismaClient, Prisma } from '@prisma/client';
import { VectorService } from './services/vector-service';
import { GeminiService } from './services/gemini-service';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();
export const { sql } = Prisma;

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { VectorService, GeminiService };
export * from '@prisma/client';