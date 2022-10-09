import { Router } from 'express';

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

authRouter.post('/refresh',
  authController.refresh,
);

authRouter.delete('/logout',
  authController.logout,
);

export default authRouter;
