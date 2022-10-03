import { RefreshTokenDataT } from '../types/usersTypes';
import { prisma } from '../database/database';

export async function insertRefreshToken(refreshTokenData: RefreshTokenDataT) {
  return prisma.refreshToken.create({
    data: refreshTokenData,
  });
}
