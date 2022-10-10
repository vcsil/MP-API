import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { MyCustomError, wrongSchemaError } from '../utils/errorUtils';

type ReqHTTPTypes = 'headers' | 'body';

type ParameterHeaderTypes = 'x-api-key' | 'authorization';

export default function validateSchema(
  schema: ObjectSchema,
  reqHTTP: ReqHTTPTypes,
  parameterHeader?: ParameterHeaderTypes,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const objectHTTP = parameterHeader ? eval('req.' + reqHTTP)[parameterHeader || '']
      : eval('req.' + reqHTTP)
    ;

    const { error } = schema.validate(objectHTTP, { abortEarly: false });
    if (error) {
      const [errorMessages] = error.details.map((detail: { message: string }) => detail.message);
      throw new MyCustomError(wrongSchemaError(errorMessages));
    }

    return next();
  };
}
