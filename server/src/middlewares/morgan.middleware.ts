import morgan, { type StreamOptions } from 'morgan'

import { logger } from '@/lib'

const stream: StreamOptions = {
    write: (message: string): void => {
        logger.http(message)
    },
}

const skip = (): boolean => {
    const env = process.env.NODE_ENV ?? 'development'
    return env !== 'development'
}

export const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream,
    skip,
})
