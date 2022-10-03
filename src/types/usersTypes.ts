import { User } from '@prisma/client';

export type CreateUserData = Omit<User, 'id' | 'createdAt'> & {
  confirmPassword: string;
};

export type InsertUserData = Omit<CreateUserData, 'confirmPassword'>;
