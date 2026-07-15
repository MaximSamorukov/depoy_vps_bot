import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  if (err.message === 'Message not found') {
    return res.status(404).json({
      error: 'Message not found',
    });
  }

  if (err.message === 'Text is required' || err.message === 'Text cannot be empty') {
    return res.status(400).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: 'Internal server error',
  });
};
