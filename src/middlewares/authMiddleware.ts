/* eslint-disable @typescript-eslint/no-throw-literal */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import * as authService from '../services/authServices/authService';
import { MyCustomError, unauthorizedError } from '../utils/errorUtils';


export async function checkAuthMiddleware(
  req: Request, res: Response, next: NextFunction,
) {
  const { authorization } = req.headers;
  if (!authorization) throw new MyCustomError(unauthorizedError('Missing authorization header'));

  const token = authorization.replace('Bearer ', '');
  if (!token) throw new MyCustomError(unauthorizedError('Missing token'));

  const secretKey: string = process.env.JWT_SECRET_KEY ?? ' ';
  try {
    const { userId } =  jwt.verify(token, secretKey)  as { userId: number };
    const user = await authService.findUserById(userId);
    res.locals.user = user;
    return next();

  } catch (error) {
    throw new MyCustomError(unauthorizedError('TokenExpiredError: jwt expired'));
  }
}
