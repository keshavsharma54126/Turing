import { PrismaClient } from '@prisma/client';
import { VectorService } from './services/vector-service';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { VectorService };
export * from '@prisma/client';