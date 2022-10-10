type AppErrorTypes = 'conflict' | 'not_found' | 'unauthorized' | 'wrong_schema' 
| 'bad_request' | 'forbidden';
export interface AppError {
  type: AppErrorTypes;
  message: string;
}

// Create new error constructor with JavaScript class
export class MyCustomError extends Error {
  type: string;

  message: string;

  constructor(objError: AppError) {
    // Call constructor of parent class Error
    super(objError.message);

    // Set your custom error name
    this.type = objError.type;
    this.message = objError.message;
  }
}

export function isAppError(error: object): error is AppError {
  return (error as AppError).type !== undefined;
}

export function errorTypeToStatusCode(type: AppErrorTypes) {
  if (type === 'bad_request') return 400;
  if (type === 'unauthorized') return 401;
  if (type === 'forbidden') return 403;
  if (type === 'not_found') return 404;
  if (type === 'conflict') return 409;
  if (type === 'wrong_schema') return 422;
  return 400;
}

export function badRequestError(message?: string): AppError {
  return { type: 'bad_request', message: message ?? '' };
}

export function unauthorizedError(message?: string): AppError {
  return { type: 'unauthorized', message: message ?? '' };
}

export function forbiddenError(message?: string): AppError {
  return { type: 'forbidden', message: message ?? '' };
}

export function notFoundError(message?: string): AppError {
  return { type: 'not_found', message: message ?? '' };
}

export function conflictError(message?: string): AppError {
  return { type: 'conflict', message: message ?? '' };
}

export function wrongSchemaError(message?: string): AppError {
  return { type: 'wrong_schema', message: message ?? '' };
}
