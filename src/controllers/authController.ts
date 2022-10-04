import { Request, Response } from 'express';

import * as userService from '../services/userService';
import * as refreshTokenService from '../services/refreshTokenService';

import { CreateUserDataT, SignInUSerDataT } from '../types/usersTypes';

export async function signUp(req: Request, res: Response) {
  const user: CreateUserDataT = req.body;

  const { id, name, email } = await userService.createUser(user);

  return res.status(201).send({ id, name, email });
}

export async function signIn(req: Request, res: Response) {
  const user: SignInUSerDataT = req.body;

  const { userIdDB, accessToken, refreshToken } = await userService.createSession(user);

  res.status(200).send({ userId: userIdDB, accessToken, refreshToken });
  return;
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken: oldRefreshToken }: { refreshToken: string } = req.body;

  const { userId, accessToken, refreshToken } = await refreshTokenService.refreshSession(oldRefreshToken);

  return res.status(200).send({ userId, accessToken, refreshToken });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;

  await refreshTokenService.finishSession(refreshToken);

  return res.status(204).send();
}
