import { z } from 'zod'

export const userSchema = z
    .object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .nonempty(),
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email(),
        password: z
            .string({
                required_error: 'Password is required',
            })
            .min(8, { message: 'Password must be at least 8 characters' }),
        passwordConfirm: z.string({
            required_error: 'Password confirmation is required',
        }),
        photo: z.string().optional(),
        phone: z.string().optional(),
        bio: z.string().max(500).optional(),
    })
    .refine(data => data.password === data.passwordConfirm, {
        message: 'Passwords do not match',
        path: ['passwordConfirm'],
    })

export const registerSchema = z.object({
    body: userSchema,
})

export const loginSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email({
                message: 'Invalid email',
            }),
        password: z.string({
            required_error: 'Password is required',
        }),
    }),
})

export const userInputSchema = z.object({
    body: userSchema,
    params: z.object({
        id: z.string(),
    }),
})

export type CreateUserType = z.infer<typeof userInputSchema>['body']
export type GetUserType = z.infer<typeof userInputSchema>['params']
export type LoginUserType = z.infer<typeof loginSchema>['body']
