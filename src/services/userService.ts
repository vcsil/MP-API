import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

import * as userRepository from '../repositories/userRepository';
import * as refreshTokenService from './refreshTokenService';

import { hashPassword, validatePassword } from '../utils/encryptUtil';
import { CreateUserDataT, SignInUSerDataT } from '../types/usersTypes';
import { conflictError, MyCustomError, unauthorizedError } from '../utils/errorUtils';

export async function createUser(user: CreateUserDataT): Promise<User> {
  const { name, email, password } = user;

  const userDB: User | null = await userRepository.findByEmail(email);

  if (userDB) throw new MyCustomError(conflictError('An account is already linked to this email')) ;

  const hashedPassword: string = await hashPassword(password);

  return userRepository.insert({ name, email, password: hashedPassword });
}

export async function createSession(user: SignInUSerDataT) {
  const { name, password } = user;

  const userDB = await userRepository.findByName(name);

  if (!userDB) throw new MyCustomError(unauthorizedError('Cannot create session 1'));

  if (!validatePassword(password, userDB.password)) throw new MyCustomError(unauthorizedError('Cannot create session'));

  const accessToken = jwt.sign({ id: userDB.id }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '30min' });
  const refreshToken = jwt.sign({ id: userDB.id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '1d' });

  const { userIdDB } = await refreshTokenService.createRefreshToken(userDB.id, refreshToken);

  return { userIdDB, accessToken, refreshToken };
}
