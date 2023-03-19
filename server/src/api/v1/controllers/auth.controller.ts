import type { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import httpStatus from 'http-status'

import { User } from '@/api/v1/models/user.model'
import type { CreateUserType, LoginUserType } from '../schemas/user.schemas'
import { APIError, createAndSendToken } from '@/lib'
import { token } from '@/constants'

/**
 * @desc: Register a new user
 * @route: POST /api/v1/auth/register
 * @access: Public
 */
export const registerHandler = asyncHandler(
    async (req: Request<any, any, CreateUserType>, res: Response, _: NextFunction) => {
        const { name, email, password, passwordConfirm, phone, photo } = req.body

        const user = await User.create({
            name,
            email,
            password,
            passwordConfirm,
            phone,
            photo,
        })

        createAndSendToken({ user, statusCode: httpStatus.CREATED, message: 'User successfully registered', res })
    }
)

/**
 * @desc: Login a user
 * @route: POST /api/v1/auth/login
 * @access: Public
 */
export const loginHandler = asyncHandler(
    async (req: Request<any, any, LoginUserType>, res: Response, next: NextFunction) => {
        const { email, password } = req.body

        // Check if user exists and password is correct
        const user = await User.findOne({ email }).select('+password')
        const isPasswordCorrect = await user?.comparePasswords(password, user?.password as string)

        if (user === null || isPasswordCorrect === false) {
            return next(APIError.unauthorized('Incorrect email or password'))
        }

        createAndSendToken({ user, statusCode: httpStatus.OK, message: 'User successfully logged in', res })
    }
)

/**
 * @desc: Logout a user
 * @route: GET /api/v1/auth/logout
 * @access: Public
 */
export const logoutHandler = asyncHandler(async (_: Request, res: Response, next: NextFunction) => {
    res.clearCookie(token)

    res.status(httpStatus.OK).json({
        status: 'success',
        message: 'User successfully logged out',
    })
})
