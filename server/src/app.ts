import express from 'express'

import { apiV1Router } from './api/v1/routes'
import { morganMiddleware } from './middlewares'

const app = express()

// Apply middleware here 👇🏼
app.use(express.json())
app.use(morganMiddleware)

// Apply routes here 👇🏼
app.use('/api/v1', apiV1Router)

export { app }
