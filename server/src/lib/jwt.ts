import type { Response } from 'express'
import config from 'config'
import { ObjectId } from 'bson'
import jwt from 'jsonwebtoken'
import ms from 'ms'

import { APIError } from '@/lib'
import type { IUser } from '@/api/v1/models/user.model'
import { token } from '@/constants'

const JWT_SECRET = config.get<string>('JWT_SECRET')
const JWT_EXPIRE = config.get<string>('JWT_EXPIRE')
const NODE_ENV = config.get<string>('NODE_ENV')

export const generateToken = (id: string | ObjectId): string => {
    // convert ObjectId to string
    if (id instanceof ObjectId) id = id.toString()

    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
    })
}

interface CreateAndSendProps {
    user: IUser
    statusCode: number
    message: string
    res: Response
}

export const createAndSendToken = ({ user, statusCode, message, res }: CreateAndSendProps): void => {
    const jwtToken = generateToken(user._id)
    const expiresInMilliseconds = ms(JWT_EXPIRE)
    let expirationDate: Date

    if (typeof expiresInMilliseconds === 'number') {
        expirationDate = new Date(Date.now() + expiresInMilliseconds)
    } else {
        throw APIError.internal(`Invalid jwt expiration format: ${JWT_EXPIRE}`)
    }

    res.cookie(token, jwtToken, {
        expires: expirationDate,
        httpOnly: true,
        secure: NODE_ENV === 'production', // only send cookie over https in production
        sameSite: 'none',
    })

    // remove password from output (security)
    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        message,
        data: { user },
    })
}
