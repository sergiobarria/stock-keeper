import httpStatus from 'http-status'

enum ErrorStatus {
    Fail = 'fail',
    Error = 'error'
}

export class APIError extends Error {
    constructor(
        public message: string,
        public status: string,
        public statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
        public code?: number
    ) {
        super(message)

        this.statusCode = statusCode
        this.status = `${status}`.startsWith('4') ? ErrorStatus.Fail : ErrorStatus.Error
        this.code = code
        this.message = message

        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.BAD_REQUEST)
    }

    static unauthorized(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.UNAUTHORIZED)
    }

    static forbidden(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.FORBIDDEN)
    }

    static notFound(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.NOT_FOUND)
    }

    static conflict(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.CONFLICT)
    }

    static tooMany(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.TOO_MANY_REQUESTS)
    }

    static internal(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.INTERNAL_SERVER_ERROR)
    }

    static notImplemented(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.NOT_IMPLEMENTED)
    }

    static badGateway(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.BAD_GATEWAY)
    }

    static serviceUnavailable(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.SERVICE_UNAVAILABLE)
    }

    static gatewayTimeout(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.GATEWAY_TIMEOUT)
    }

    static dbError(message: string): APIError {
        return new APIError(message, ErrorStatus.Fail, httpStatus.INTERNAL_SERVER_ERROR)
    }
}
