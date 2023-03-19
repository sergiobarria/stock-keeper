import type { Request, Response, NextFunction } from 'express'
import { type AnyZodObject, ZodError } from 'zod'
import httpStatus from 'http-status'

export const validate = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            })

            next()
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(httpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: err.issues.map(issue => issue.message).join(', '),
                    errors: err.flatten(),
                })
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: 'Something went wrong',
                })
            }
        }
    }
}
