import { Prisma, RefreshToken } from '@prisma/client';

import { RefreshTokenDataT } from '../types/tokenTypes';
import { prisma } from '../database/database';

export async function insertRefreshToken(refreshTokenData: RefreshTokenDataT): Promise<RefreshToken> {
  return prisma.refreshToken.create({
    data: refreshTokenData,
  });
}

export async function findByRefreshToken(refreshToken: string): Promise<RefreshToken | null> {
  return prisma.refreshToken.findUnique({
    where: { refreshToken },
  });
}

export async function deleteRefreshTokens(userId: number): Promise<Prisma.BatchPayload> {
  return prisma.refreshToken.deleteMany({
    where: { userId },
  });
}

export async function updateRefreshToken(id: number, refreshToken: string): Promise<RefreshToken> {
  return prisma.refreshToken.update({
    where: { id },
    data: { refreshToken },
  });
}

export async function deleteRefreshToken(id: number): Promise<RefreshToken> {
  return prisma.refreshToken.delete({
    where: { id },
  });
}
