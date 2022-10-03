import { Request, Response } from 'express';

import * as userService from '../services/userService';
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
