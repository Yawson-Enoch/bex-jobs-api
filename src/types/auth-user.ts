import type { Prisma } from '@prisma/client';

/* type of data used to sign token */
export type AuthUser = Prisma.UserGetPayload<{
  select: { id: true; email: true };
}>;
