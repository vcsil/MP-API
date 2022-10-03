import { User } from '@prisma/client';

import { InsertUserDataT } from '../types/usersTypes';
import { prisma } from '../database/database';

export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function insert(userData: InsertUserDataT): Promise<User> {
  return prisma.user.create({
    data: userData,
  });
}

export async function findByName(name: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { name },
  });
}
