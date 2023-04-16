import express, { type Request, type Response } from 'express'
import httpStatus from 'http-status'

import { authRouter } from './auth'

const router = express.Router()

/**
 * @desc: Healthcheck endpoint
 * @endpoint: /api/v1/healthcheck
 */
router.get('/healthcheck', (_: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        success: true,
        message: 'server is running',
        details: {
            name: 'Touric Server API',
            version: '1.0.0',
            uptime: process.uptime(),
            memory: process.memoryUsage()
        }
    })
})

// ===== Register Routes 👇🏼 =====
router.use('/auth', authRouter)

export { router as routerV1 }
