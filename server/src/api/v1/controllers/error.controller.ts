import type { NextFunction, Request, Response } from 'express'
import { Error as MongooseError } from 'mongoose'
import config from 'config'
import httpStatus from 'http-status'

import { logger, type APIError } from '@/lib'

interface ErrorReply {
    fieldName?: string
    statusCode: number
    name: string
    message: string
}

type ErrorTypes = Record<string, (fieldName?: string) => ErrorReply>

const errors: ErrorTypes = {
    MongoServerError: value => ({
        statusCode: httpStatus.CONFLICT,
        name: 'MongoServerError',
        message: value !== undefined ? `Duplicate key: ${value}` : 'Duplicate key',
    }),
    CastError: value => ({
        statusCode: httpStatus.BAD_REQUEST,
        name: 'CastError',
        message: value !== undefined ? `Invalid ${value}` : 'Invalid value',
    }),
    ValidationError: value => ({
        statusCode: httpStatus.BAD_REQUEST,
        name: 'ValidationError',
        message: value !== undefined ? `Invalid ${value}` : 'Invalid value',
    }),
    JsonWebTokenError: () => ({
        statusCode: httpStatus.UNAUTHORIZED,
        name: 'JsonWebTokenError',
        message: 'Invalid token',
    }),
    TokenExpiredError: () => ({
        statusCode: httpStatus.UNAUTHORIZED,
        name: 'TokenExpiredError',
        message: 'Token expired',
    }),
    default: () => ({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        name: 'InternalError',
        message: 'Internal error',
    }),
}

function handleDuplicateKeyError(err: APIError): ErrorReply {
    const fieldName = err.message.match(/(["'])(\\?.)*?\1/)?.[0] ?? ''
    const error = errors[err.name](fieldName)
    return error
}

function handleValidationError(err: APIError): ErrorReply {
    const fieldName = err.message.match(/(["'])(\\?.)*?\1/)?.[0] ?? ''
    const error = errors[err.name](fieldName)
    return error
}

function handleCastError(err: APIError): ErrorReply {
    const fieldName = err.message.match(/(["'])(\\?.)*?\1/)?.[0] ?? ''
    const error = errors[err.name](fieldName)
    return error
}

export const globalErrorHandler = (err: APIError, _: Request, res: Response, next: NextFunction): void => {
    let error = { ...err }
    error.message = err.message

    const ENV = config.get<string>('NODE_ENV')

    if (err instanceof MongooseError.CastError) {
        error = handleCastError(err)
    }

    if (err instanceof MongooseError.ValidationError) {
        error = handleValidationError(err)
    }

    if (err.name === 'MongoServerError' && err.code === 11000) {
        error = handleDuplicateKeyError(err)
    }

    if (ENV !== 'development') {
        error.stack = err.stack

        res.status(error.statusCode).json(error)
    } else {
        logger.error('ERROR 💥', err)
        res.status(error.statusCode).json({
            name: error.name,
            message: error.message,
            statusCode: error.statusCode,
        })
    }
}
