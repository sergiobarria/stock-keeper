import express, { type NextFunction, type Request, type Response } from 'express'
import { globalErrorHandler } from './api/v1/controllers/error.controller'

import { apiV1Router } from './api/v1/routes'
import { APIError } from './lib/apiError'
import { morganMiddleware } from './middlewares'

const app = express()

// Apply middleware here 👇🏼
app.use(express.json())
app.use(morganMiddleware)

// Apply routes here 👇🏼
app.use('/api/v1', apiV1Router)

app.all('*', (req: Request, _: Response, next: NextFunction) => {
    next(APIError.notFound(`Can't find ${req.originalUrl} on this server!`))
})

app.use(globalErrorHandler)

export { app }
