import { User } from '@prisma/client';

export type CreateUserDataT = Omit<User, 'id' | 'createdAt'> & {
  confirmPassword: string;
};

export type SignInUSerDataT = Omit<CreateUserDataT, 'email' | 'confirmPassword'>;

export type InsertUserDataT = Omit<CreateUserDataT, 'confirmPassword'>;
