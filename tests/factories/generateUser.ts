import { faker } from '@faker-js/faker';
import { CreateUserDataT } from '../../src/types/usersTypes';

export default async function userFactory(): Promise<CreateUserDataT> {
  const password = faker.internet.password();

  const user: CreateUserDataT = {
    name: faker.name.firstName().toLowerCase(),
    email: faker.internet.email().toLowerCase(),
    password,
    confirmPassword: password,
  };

  return user;
}

export async function userIdFactory(): Promise<number> {
  return faker.datatype.number(100);
}

export async function createdAtFactory(): Promise<Date> {
  return faker.datatype.datetime();
}

export async function tokenFactory(): Promise<string> {
  return faker.datatype.uuid();
}
