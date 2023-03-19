import * as crypto from 'crypto'

import type { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import httpStatus from 'http-status'

import type {
    CreateUserType,
    ForgotPasswordType,
    LoginUserType,
    ResetPasswordType,
    UpdatePasswordType,
} from '../schemas/user.schemas'
import { APIError, createAndSendToken, sendEmail } from '@/lib'
import { token } from '@/constants'
import { createUser, findUser, findUserById } from '../services/user.service'
import { resetPasswordTemplate } from '@/utils'

/**
 * @desc: Register a new user
 * @route: POST /api/v1/auth/register
 * @access: Public
 */
export const registerHandler = asyncHandler(
    async (req: Request<any, any, CreateUserType>, res: Response, _: NextFunction) => {
        const { name, email, password, passwordConfirm, phone, photo } = req.body

        const user = await createUser({ name, email, password, passwordConfirm, phone, photo })

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
        const user = await findUser({ email })
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

/**
 * @desc: Reset a user's password
 * @route: POST /api/v1/auth/update-password
 * @access: Private
 */
export const updatePasswordHandler = asyncHandler(
    async (req: Request<any, any, UpdatePasswordType>, res: Response, next: NextFunction) => {
        const { passwordCurrent, password, passwordConfirm } = req.body

        // Get user from collection
        const user = await findUserById(req.user?.id)

        if (user === null) {
            return next(APIError.unauthorized('User not found'))
        }

        // Check if Posted current password is correct
        const isPasswordCorrect = await user?.comparePasswords(passwordCurrent, user?.password as string)

        if (!isPasswordCorrect) return next(APIError.unauthorized('Incorrect user credentials'))

        // Update password
        user.password = password
        user.passwordConfirm = passwordConfirm
        await user.save()

        createAndSendToken({ user, statusCode: httpStatus.OK, message: 'Password successfully updated', res })
    }
)

/**
 * @desc: Forgot a user's password
 * @route: POST /api/v1/auth/forgot-password
 * @access: Public
 */
export const forgotPasswordHandler = asyncHandler(
    async (req: Request<any, any, ForgotPasswordType>, res: Response, next: NextFunction) => {
        const { email } = req.body
        console.log(email)

        const user = await findUser({ email })

        if (user === null) return next(APIError.notFound('User not found'))

        // If user exists, generate the random reset token
        const resetToken = user?.createPasswordResetToken()
        await user?.save({ validateBeforeSave: false }) // Disable validation before saving

        // Send it to user's email
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`

        const message = resetPasswordTemplate({ username: req?.user?.name ?? email, resetUrl })

        try {
            await sendEmail({
                to: user?.email,
                subject: 'Your password reset token (valid for 10 minutes)',
                html: message,
            })
        } catch (error) {
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user?.save({ validateBeforeSave: false })

            return next(APIError.internal('There was an error sending the email. Try again later!'))
        }

        res.status(httpStatus.OK).json({
            status: 'success',
            message: 'Token sent to email!',
        })
    }
)

/**
 * @desc: Reset password
 * @endpoint: GET /api/v1/auth/forgot-password
 * @access: Public
 */
export const resetPasswordHandler = asyncHandler(
    async (
        req: Request<ResetPasswordType['params'], any, ResetPasswordType['body']>,
        res: Response,
        next: NextFunction
    ) => {
        const { token } = req.params
        const { password, passwordConfirm } = req.body

        // Get user based on the token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await findUser({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

        if (user === null) return next(APIError.unauthorized('Token is invalid or has expired'))

        // If token has not expired, and there is user, set the new password
        user.password = password
        user.passwordConfirm = passwordConfirm
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()

        createAndSendToken({ user, statusCode: httpStatus.OK, message: 'Password successfully updated', res })
    }
)
