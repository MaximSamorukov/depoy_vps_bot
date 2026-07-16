import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const createMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be less than 1000 characters'),
});

export const updateMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be less than 1000 characters')
    .optional(),
});

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
