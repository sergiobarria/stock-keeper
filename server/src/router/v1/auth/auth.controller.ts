import type { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import asyncHandler from 'express-async-handler'

import type { RegisterUserInput } from './auth.schemas'
import * as services from './auth.services'

export const registerUserHandler = asyncHandler(
    async (req: Request<any, any, RegisterUserInput>, res: Response, next: NextFunction) => {
        const user = await services.createOne(req.body)

        res.status(httpStatus.OK).json({
            success: true,
            data: { user }
        })
    }
)
