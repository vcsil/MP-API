import { Router } from 'express';
import jwt from 'jsonwebtoken';

import * as authController from '../controllers/authController';

import validateSchema from '../middlewares/schemaValidationMiddleware';
import { signUpSchema, singInSchema } from '../schemas/authSchema';

const authRouter = Router();

authRouter.post('/signup',
  validateSchema(signUpSchema, 'body'),
  authController.signUp,
);

authRouter.post('/signin',
  validateSchema(singInSchema, 'body'),
  authController.signIn,
);

authRouter.patch('/refresh',
  authController.refresh,
);

export default authRouter;
