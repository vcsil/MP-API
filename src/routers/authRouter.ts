import { Router } from 'express';

import * as authController from '../controllers/authController';

import validateSchema from '../middlewares/schemaValidationMiddleware';
import { signUpSchema } from '../schemas/authSchema';

const authRouter = Router();

authRouter.post('/signup',
  validateSchema(signUpSchema, 'body'),
  authController.signup,
);

export default authRouter;
