import type { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import asyncHandler from 'express-async-handler'
import config from 'config'

import { generateJWTToken } from '../../../lib'
import type { RegisterUserInput } from './auth.schemas'
import * as services from './auth.services'
import { APIError } from '../../../utils'

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
            data: { ...user, token }
        })
    }
)
