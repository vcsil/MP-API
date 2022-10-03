import { RefreshToken } from '@prisma/client';

export interface IToken {
  id: number;
}

export type RefreshTokenDataT = Omit<RefreshToken, 'id' | 'createdAt'>;
