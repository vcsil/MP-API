import { User } from '@prisma/client';

import { InsertUserData } from '../types/usersTypes';
import { prisma } from '../database/database';

export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function insert(userData: InsertUserData): Promise<User> {
  return prisma.user.create({
    data: userData,
  });
}
