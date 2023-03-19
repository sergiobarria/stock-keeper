import express, { type Request, type Response } from 'express'

import { authRouter } from './auth.routes'

const router = express.Router()

/**
 * @desc: Health check route
 * @endpoint: GET /api/v1/healthcheck
 */
router.get('/healthcheck', (_: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Server up and running' })
})

/**
 * @desc: Auth routes
 * @endpoint: GET /api/v1/auth
 */
router.use('/auth', authRouter)

export { router as apiV1Router }
