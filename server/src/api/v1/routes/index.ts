import express, { type Request, type Response } from 'express'

const router = express.Router()

/**
 * @desc: Health check route
 * @endpoint: GET /api/v1/healthcheck
 */
router.get('/healthcheck', (_: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Server up and running' })
})

export { router as apiV1Router }
