import type { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import asyncHandler from 'express-async-handler'

import { findUserById, findUsers, updateUser } from '../services/user.service'
import { APIError } from '@/lib'
import type { CreateUserType, GetUserType } from '../schemas/user.schemas'
import { removeFieldsFromObject } from '@/utils'

/**
 * @desc: Get all users
 * @endpoint: GET /api/v1/users
 * @access: Private
 */
export const getUsersHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await findUsers()

    res.status(httpStatus.OK).json({
        status: 'success',
        count: users?.length,
        data: { users },
    })
})

/**
 * @desc: Get user
 * @endpoint: GET /api/v1/users/:id
 * @access: Private
 */
export const getUserHandler = asyncHandler(async (req: Request<GetUserType>, res: Response, next: NextFunction) => {
    const { id } = req.params
    const user = await findUserById(id)

    if (user === null) {
        return next(APIError.notFound('User not found'))
    }

    res.status(httpStatus.OK).json({
        status: 'success',
        data: { user },
    })
})

/**
 * @desc: Update user
 * @endpoint: PATCH /api/v1/users/:id
 * @access: Private
 */
export const updateMeHandler = asyncHandler(
    async (req: Request<GetUserType, any, CreateUserType>, res: Response, next: NextFunction) => {
        const { _id } = req.user
        const filteredObj = removeFieldsFromObject(req.body, ['email'])
        const updatedUser = await updateUser(_id, filteredObj)

        if (updatedUser === null) {
            return next(APIError.notFound('User not found'))
        }

        res.status(httpStatus.OK).json({
            status: 'success',
            data: { user: updatedUser },
        })
    }
)
