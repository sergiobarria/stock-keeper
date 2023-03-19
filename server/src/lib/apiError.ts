import httpStatus from 'http-status'

export class APIError extends Error {
    constructor(public message: string, public statusCode: number, public code?: number) {
        super(message)
        this.name = this.constructor.name
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message: string, code?: number): APIError {
        return new APIError(message, httpStatus.BAD_REQUEST, code)
    }

    static unauthorized(message: string, code?: number): APIError {
        return new APIError(message, httpStatus.UNAUTHORIZED, code)
    }

    static forbidden(message: string, code?: number): APIError {
        return new APIError(message, httpStatus.FORBIDDEN, code)
    }

    static notFound(message: string, code?: number): APIError {
        return new APIError(message, httpStatus.NOT_FOUND, code)
    }

    static duplicateKey(message: string, code?: number): APIError {
        return new APIError(message, httpStatus.CONFLICT, code)
    }

    static internal(message: string, code?: number): APIError {
        return new APIError(message, httpStatus.INTERNAL_SERVER_ERROR, code)
    }

    static notImplemented(message: string, code?: number): APIError {
        return new APIError(message, httpStatus.NOT_IMPLEMENTED, code)
    }
}
