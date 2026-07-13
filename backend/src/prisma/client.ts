import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient Singleton Instance Proxy
 * 
 * Prevents multiple instances of Prisma Client from being instantiated 
 * in development environments due to hot-reloading.
 * 
 * Implements a Lazy Proxy to handle cases where Prisma Client has not been
 * generated yet (e.g. before any database models are defined). This allows
 * the application to boot up and run health checks without crashing on Prisma initialization.
 */
declare global {
  // Allow global var declarations in TypeScript
  // eslint-disable-next-line no-var
  var prismaInstance: PrismaClient | undefined;
}

const getPrismaInstance = (): PrismaClient => {
  if (!globalThis.prismaInstance) {
    globalThis.prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return globalThis.prismaInstance;
};

// Export a lazy proxy that delegates all property accesses to the singleton instance
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop, receiver) => {
    try {
      const instance = getPrismaInstance();
      const value = Reflect.get(instance, prop);
      
      if (typeof value === 'function') {
        return value.bind(instance);
      }
      return value;
    } catch (error) {
      // If the client hasn't been generated yet, allow $disconnect to be called safely during graceful shutdown
      if (prop === '$disconnect') {
        return () => Promise.resolve();
      }
      
      // Re-throw with a descriptive message for other properties
      console.error('[Prisma Client Error]: Failed to access Prisma Client. Ensure "npx prisma generate" has been run with models.');
      throw error;
    }
  },
});
