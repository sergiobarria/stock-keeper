import { promisify } from 'util'

import type { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import config from 'config'

import { APIError } from '@/lib'
import { findUserById } from '@/api/v1/services/user.service'

interface DecodedToken {
    id: string
    iat: number
    exp: number
}

const JWT_SECRET = config.get<string>('JWT_SECRET')

const verifyToken = promisify(jwt.verify)

/**
 * @desc: Protect routes from unauthenticated users
 * @endpoint: N/A (middleware)
 */
export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined

    if (req?.headers?.authorization?.startsWith('Bearer') === true) {
        token = req?.headers?.authorization?.split(' ')[1]
    }

    if (token === undefined) {
        return next(APIError.unauthorized('You are not logged in. Please log in to get access.'))
    }

    // @ts-expect-error - This works, but TS doesn't like it, maybe an issue with jwt.verify types
    const decoded: DecodedToken = await verifyToken(token, JWT_SECRET)
    const currUser = await findUserById(decoded.id)

    if (currUser === null) {
        return next(APIError.unauthorized('The user belonging to this token does no longer exist.'))
    }

    if (currUser.changedPasswordAfter(decoded.iat)) {
        return next(APIError.unauthorized('User recently changed password! Please log in again.'))
    }

    req.user = currUser
    next()
})
