import { Request, Response } from 'express';

import * as userService from '../services/userService';
import { CreateUserData } from '../types/usersTypes';

export async function signup(req: Request, res: Response) {
  const user: CreateUserData = req.body;

  const { id, name, email } = await userService.createUser(user);

  return res.status(201).send({ id, name, email });
}
