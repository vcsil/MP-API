import { NextFunction, Request, Response } from 'express';
import {
  AppError,
  errorTypeToStatusCode,
  isAppError,
} from '../utils/errorUtils';

export function errorHandlerMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('\n', err, '\n');

  if (isAppError(err)) {
    return res.status(errorTypeToStatusCode(err.type)).send(err.message);
  }

  return res.status(500).send(err.message);
}
