import type { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import config from 'config'

import type { APIError } from '../utils/apiError'

export const globalErrorHandler = (err: APIError, _: Request, res: Response, __: NextFunction): void => {
    const statusCode = res.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR
    const env = config.get<string>('NODE_ENV')

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: env === 'development' ? err.stack : undefined
    })
}
