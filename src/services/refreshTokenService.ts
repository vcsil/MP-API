import { RefreshToken } from '@prisma/client';
import jwt from 'jsonwebtoken';

import * as refreshTokenRepository from '../repositories/refreshTokenRepository';
import * as userRepository from '../repositories/userRepository';

import { forbiddenError, MyCustomError, notFoundError } from '../utils/errorUtils';
import { IToken } from '../types/tokenTypes';

export async function createRefreshToken(userId: number, refreshToken: string) {
  const { userId: userIdDB } = await refreshTokenRepository.insertRefreshToken({ userId, refreshToken });
  return { userIdDB };
}

export async function refreshSession(oldRefreshToken: string):
Promise<{ name: string, userId: number, accessToken: string, refreshToken: string }> {
  if (!oldRefreshToken) throw new MyCustomError(notFoundError('Null token'));

  const currentRefreshToken: RefreshToken | null = await refreshTokenRepository.findByRefreshToken(oldRefreshToken);
  // Se não encontrar nenhuma sessão com esse refresh token
  // Exclui todas sessões do usuário que tinha aquele refresh token inválido
  if (!currentRefreshToken) {
    try {

      const decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET as string);
      await refreshTokenRepository.deleteRefreshTokens((decoded as IToken).id);
    } catch {
      throw new MyCustomError(forbiddenError('Cannot refresh session'));
    }

    throw new MyCustomError(forbiddenError('Cannot refresh session'));
  }

  try {
    const payload = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET as string);

    if (currentRefreshToken.userId !== (payload as IToken).id) {
      throw new MyCustomError(forbiddenError(''));
    }

    const accessToken = jwt.sign({ id: (payload as IToken).id }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '30min' });
    const refreshToken = jwt.sign({ id: (payload as IToken).id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '1d' });

    const { userId } = await refreshTokenRepository.updateRefreshToken(currentRefreshToken.id, refreshToken);
    const user = await userRepository.findById(userId);
    if (!user) throw new MyCustomError(notFoundError('Id not exit'));

    return { name: user.name, userId, accessToken, refreshToken };
  } catch (err) {
    await refreshTokenRepository.deleteRefreshToken(currentRefreshToken.id);
    throw new MyCustomError(forbiddenError(''));
  }
}

export async function finishSession(oldRefreshToken: string): Promise<RefreshToken> {
  const currentRefreshToken: RefreshToken | null = await refreshTokenRepository.findByRefreshToken(oldRefreshToken);

  if (!currentRefreshToken) {
    throw new MyCustomError(notFoundError(''));
  }

  return refreshTokenRepository.deleteRefreshToken(currentRefreshToken.id);
}
