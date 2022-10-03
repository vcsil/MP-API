import { User } from '@prisma/client';
import { CreateUserData } from '../types/usersTypes';

import * as userRepository from '../repositories/userRepository';

import { hashPassword } from '../utils/encryptUtil';
import { conflictError, MyCustomError } from '../utils/errorUtils';

export async function createUser(user: CreateUserData): Promise<User> {
  const { name, email, password } = user;

  const userDB: User | null = await userRepository.findByEmail(email);

  if (userDB) throw new MyCustomError(conflictError('An account is already linked to this email')) ;

  const hashedPassword: string = await hashPassword(password);

  return userRepository.insert({ name, email, password: hashedPassword });
}
