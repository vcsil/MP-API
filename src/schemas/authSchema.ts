import joi from 'joi';

import { CreateUserData } from '../types/usersTypes';

interface AuthT {
  Authorization: string
}

export const signUpSchema = joi.object<CreateUserData>({
  name: joi.string().trim().required(),
  email: joi.string().email().trim().required(),
  password: joi.string().required(),
  confirmPassword: joi.ref('password'),
});

const bearerRegex = /^Bearer /;

export const authTokenSchema = joi.object<AuthT>({
  Authorization: joi.string().pattern(bearerRegex, { name: 'Authorizatoin' })
    .required().messages({
      'any.required': 'Token is required',
      'string.empty': 'Invalid value',
    }),
});

export const apiKeySchema = joi.string().required().messages({
  'any.required': 'Api key is required',
  'string.empty': 'Invalid value',
});
