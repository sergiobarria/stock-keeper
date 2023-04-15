import express from 'express'
import config from 'config'

import { routerV1 } from './router/v1'
import { morganMiddleware } from './middlewares'

export const app = express()
const env = config.get<string>('NODE_ENV')

// ===== Register Middleware 👇🏼 =====
app.use(express.json())
if (env === 'development') {
    app.use(morganMiddleware)
}

// ===== Register Routes 👇🏼 =====
app.use('/api/v1', routerV1)

// ===== Register Prisma Middleware 👇🏼 =====
