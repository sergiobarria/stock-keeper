import express, { type Request, type Response } from 'express'

import { authRouter } from './auth.routes'
import { userRouter } from './user.routes'

const router = express.Router()

/**
 * @desc: Health check route
 * @endpoint: /api/v1/healthcheck
 */
router.get('/healthcheck', (_: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Server up and running' })
})

/**
 * @desc: Auth routes
 * @endpoint: /api/v1/auth
 */
router.use('/auth', authRouter)

/**
 * @desc: User routes
 * @endpoint: /api/v1/users
 */
router.use('/users', userRouter)

export { router as apiV1Router }
