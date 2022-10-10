/* eslint-disable import/no-extraneous-dependencies */
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

import * as refreshTokenService from '../../src/services/refreshTokenService';
import * as userRepository from '../../src/repositories/userRepository';
import * as encryptUtil from '../../src/utils/encryptUtil';
import * as userService from '../../src/services/userService';
import userFactory from '../factories/generateUser';
import { conflictError, MyCustomError, unauthorizedError } from '../../src/utils/errorUtils';

beforeEach(async () => {
  jest.resetAllMocks();
});

describe('Testa createUser', () => {
  it('Deve criar um usuário', async () => {
    const user = await userFactory();

    jest.spyOn(
      userRepository,
      'findByEmail',
    ).mockImplementationOnce((): any => null);

    jest.spyOn(
      userRepository,
      'findByName',
    ).mockImplementationOnce((): any => null);

    jest.spyOn(
      encryptUtil,
      'hashPassword',
    ).mockImplementationOnce((): any => user.password);

    const promise = await userService.createUser(user);

    expect(userRepository.findByEmail).toBeCalled();
    expect(userRepository.findByName).toBeCalled();
    expect(promise.name).toBe(user.name);
    expect(promise.email).toBe(user.email);
    expect(promise.password).toBe(user.password);
  });

  it('Não deve criar usuário com email repetido', async () => {
    const user = await userFactory();

    jest.spyOn(
      userRepository,
      'findByEmail',
    ).mockImplementationOnce((): any => ({
      ...user,
      id: 3,
      createdAt: '2022-10-09T22:50:58.729Z',
    }));

    const promise = userService.createUser(user);

    expect(promise).rejects.toBeInstanceOf(MyCustomError);
    expect(promise).rejects.toEqual(new MyCustomError(conflictError('An account is already linked to this email')));
  });

  it('Não deve criar usuário com nome repetido', async () => {
    const user = await userFactory();

    jest.spyOn(
      userRepository,
      'findByEmail',
    ).mockImplementationOnce((): any => null);

    jest.spyOn(
      userRepository,
      'findByName',
    ).mockImplementationOnce((): any => ({
      ...user,
      id: 3,
      createdAt: '2022-10-09T22:50:58.729Z',
    }));

    const promise = userService.createUser(user);

    expect(promise).rejects.toBeInstanceOf(MyCustomError);
    expect(promise).rejects.toEqual(new MyCustomError(conflictError('An account is already linked to this name')));
  });
});

describe('Testa createSession', () => {
  it('Deve criar uma sessão', async () => {
    const { name, email, password } = await userFactory();
    const userIdDB = 4;
    const accessToken = 'accessToken';
    const refreshToken = 'refreshToken';

    jest.spyOn(
      userRepository,
      'findByName',
    ).mockImplementationOnce((): any => ({
      id: userIdDB,
      name,
      email,
      password,
      createdAt: '2022-10-09T22:50:58.729Z',
    }));

    jest.spyOn(
      encryptUtil,
      'validatePassword',
    ).mockImplementationOnce((): any => true);

    jest.spyOn(
      jwt,
      'sign',
    ).mockImplementationOnce((): any => accessToken)
      .mockImplementationOnce((): any => refreshToken);

    jest.spyOn(
      refreshTokenService,
      'createRefreshToken',
    ).mockImplementationOnce((): any => ({ userIdDB }));

    const promise = await userService.createSession({ name, password });

    expect(userRepository.findByName).toBeCalled();
    expect(encryptUtil.validatePassword).toBeCalled();
    expect(jwt.sign).toBeCalled();
    expect(refreshTokenService.createRefreshToken).toBeCalled();
    expect(promise).toMatchObject({ userIdDB, accessToken, refreshToken });
  });

  it('Não deve criar sessão com usuário inexistente', async () => {
    const { name, password } = await userFactory();

    jest.spyOn(
      userRepository,
      'findByName',
    ).mockImplementationOnce((): any => null);


    const promise = userService.createSession({ name, password });

    expect(promise).rejects.toBeInstanceOf(MyCustomError);
    expect(promise).rejects.toEqual(new MyCustomError(unauthorizedError('Cannot create session 1')));

    expect(userRepository.findByName).toBeCalled();
    expect(encryptUtil.validatePassword).not.toBeCalled();
    expect(jwt.sign).not.toBeCalled();
    expect(refreshTokenService.createRefreshToken).not.toBeCalled();
  });

  it('Não deve criar sessão com senha errada', async () => {
    const { name, email, password } = await userFactory();
    const userIdDB = 4;

    jest.spyOn(
      userRepository,
      'findByName',
    ).mockImplementationOnce((): any => ({
      id: userIdDB,
      name,
      email,
      password,
      createdAt: '2022-10-09T22:50:58.729Z',
    }));

    jest.spyOn(
      encryptUtil,
      'validatePassword',
    ).mockImplementationOnce((): any => false);

    const promise = userService.createSession({ name, password });

    expect(promise).rejects.toBeInstanceOf(MyCustomError);
    expect(promise).rejects.toEqual(new MyCustomError(unauthorizedError('Cannot create session')));

    expect(userRepository.findByName).toBeCalled();

    expect(jwt.sign).not.toBeCalled();
    expect(refreshTokenService.createRefreshToken).not.toBeCalled();
  });

});
