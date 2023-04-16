import express from 'express'
import config from 'config'

import { routerV1 } from './router/v1'
import { morganMiddleware, globalErrorHandler, authMiddlware } from './middlewares'
import { prisma } from './lib'

export const app = express()
const env = config.get<string>('NODE_ENV')

// ===== Register Middleware 👇🏼 =====
app.use(express.json())
if (env === 'development') {
    app.use(morganMiddleware)
}

// ===== Register Routes 👇🏼 =====
app.use('/api/v1', routerV1)

// ===== Register Error Handler 👇🏼 =====
app.use(globalErrorHandler)

// ===== Register Prisma Middleware 👇🏼 =====
prisma.$use(authMiddlware)
