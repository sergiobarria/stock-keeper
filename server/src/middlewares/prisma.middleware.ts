import type { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import config from 'config'

// This file includes all the middleware functions applied to the prisma client
type PrismaNextFunc = (params: Prisma.MiddlewareParams) => Promise<Prisma.MiddlewareParams>

export async function authMiddlware(
    params: Prisma.MiddlewareParams,
    next: PrismaNextFunc
): Promise<Prisma.MiddlewareParams> {
    const collection = 'User'
    const rounds = config.get<string>('SALT_ROUNDS')

    // Actions BEFORE creating a new user 👇🏼
    if (params.model === collection && params.action === 'create') {
        // hash the password before saving it to the database
        const salt = await bcrypt.genSalt(parseInt(rounds, 10))
        params.args.data.password = await bcrypt.hash(params.args.data.password, salt)
    }

    const result = await next(params)

    // Actions BEFORE creating a new user 👇🏼
    if (params.model === collection && params.action === 'create') {
        // logic here
    }

    return result
}
