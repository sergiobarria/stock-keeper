import type { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import asyncHandler from 'express-async-handler'
import config from 'config'

import { generateJWTToken } from '../../../lib'
import type { LoginUserInput, RegisterUserInput } from './auth.schemas'
import * as services from './auth.services'
import { APIError } from '../../../utils'

/**
 * @desc: Register a new user
 * @endpoint: POST /api/v1/auth/register
 * @access: public
 */
export const registerUserHandler = asyncHandler(
    async (req: Request<any, any, RegisterUserInput>, res: Response, next: NextFunction) => {
        const user = await services.createOne(req.body)

        if (user === null) {
            return next(APIError.internal('failed to create user'))
        }

        // generate a token for the user
        const token = generateJWTToken(user?.id as string)

        res.cookie('token', token, {
            httpOnly: true,
            secure: config.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        })

        res.status(httpStatus.CREATED).json({
            success: true,
            data: { user }
        })
    }
)

/**
 * @desc: Login user
 * @endpoint: POST /api/v1/auth/login
 * @access: public
 */
export const loginUserHandler = asyncHandler(
    async (req: Request<any, any, LoginUserInput>, res: Response, next: NextFunction) => {
        const user = await services.login(req.body)

        if (user === null) {
            return next(APIError.unauthorized('invalid email or password'))
        }

        const token = generateJWTToken(user?.id as string)

        res.cookie('token', token, {
            httpOnly: true,
            secure: config.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        })

        res.status(httpStatus.OK).json({
            success: true,
            data: { user }
        })
    }
)

/**
 * @desc: Logout user
 * @endpoint: GET /api/v1/auth/logout
 * @access: private
 */
export const logoutUserHandler = asyncHandler(async (req: Request, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: config.get<string>('NODE_ENV') === 'production',
        sameSite: 'none',
        expires: new Date(0) // 0 means expire immediately
    })

    res.status(httpStatus.OK).json({
        success: true,
        message: 'logged out successfully',
        data: null
    })
})
