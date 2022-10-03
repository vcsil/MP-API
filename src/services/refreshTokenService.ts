import * as refreshTokenRepository from '../repositories/refreshTokenRepository';

export async function createRefreshToken(userId: number, refreshToken: string) {
  const { userId: userIdDB } = await refreshTokenRepository.insertRefreshToken({ userId, refreshToken });
  return { userIdDB };
}

