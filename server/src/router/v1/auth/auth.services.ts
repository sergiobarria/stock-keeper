import type { User } from '@prisma/client'
import { pick, omit } from 'lodash'
import bcrypt from 'bcryptjs'

import { prisma } from '../../../lib'
import type { LoginUserInput, RegisterUserInput } from './auth.schemas'

const userFields = ['name', 'email', 'photo', 'phone', 'bio', 'password']
const omitFields = ['password']

export const createOne = async (data: RegisterUserInput): Promise<Partial<User> | null> => {
    const sanitizedData = pick(data, userFields) as RegisterUserInput

    // check if user already exists
    const user = await prisma.user.findUnique({ where: { email: sanitizedData.email } })
    if (user !== null) return null // null means user already exists

    const newUser = await prisma.user.create({
        data: sanitizedData
    })

    return omit(newUser, omitFields)
}

export const login = async (data: LoginUserInput): Promise<Partial<User> | null> => {
    // check if user exists
    const user = await prisma.user.findUnique({ where: { email: data.email } })

    if (user === null || !(await bcrypt.compare(data.password, user.password))) return null

    return omit(user, omitFields)
}
