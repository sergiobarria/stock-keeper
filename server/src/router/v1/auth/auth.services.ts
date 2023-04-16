import type { User } from '@prisma/client'
import { pick, omit } from 'lodash'

import { prisma } from '../../../lib'
import type { RegisterUserInput } from './auth.schemas'
import { APIError } from '../../../utils/apiError'

const userFields = ['name', 'email', 'photo', 'phone', 'bio', 'password']
const omitFields = ['password']

export const createOne = async (data: RegisterUserInput): Promise<Partial<User> | null> => {
    const sanitizedData = pick(data, userFields) as RegisterUserInput

    // check if user already exists
    const user = await prisma.user.findUnique({ where: { email: sanitizedData.email } })
    if (user !== null) {
        throw APIError.conflict('a user with that email account already exists')
    }

    const newUser = await prisma.user.create({
        data: sanitizedData
    })

    return omit(newUser, omitFields)
}
