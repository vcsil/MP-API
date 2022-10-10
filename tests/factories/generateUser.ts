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

