import { z } from 'zod'

export const userSchema = z.object({
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

export const registerSchema = z.object({
    body: userSchema.refine(data => data.password === data.passwordConfirm, {
        message: 'Passwords do not match',
        path: ['passwordConfirm'],
    }),
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

export const updateMeSchema = z.object({
    body: userSchema.merge(z.object({ id: z.string() })),
})

export const updatePasswordSchema = z.object({
    body: z
        .object({
            passwordCurrent: z.string({
                required_error: 'Please provide your current password',
            }),
            password: z.string({
                required_error: 'Please provide a password',
            }),
            passwordConfirm: z.string({
                required_error: 'Please confirm your password',
            }),
        })
        .refine(data => data.password === data.passwordConfirm, {
            message: 'New passwords do not match',
            path: ['passwordConfirm'],
        }),
})

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Please provide your email',
            })
            .email(),
    }),
})

export const resetPasswordSchema = z.object({
    body: z.object({
        password: z.string({
            required_error: 'Please provide a password',
        }),
        passwordConfirm: z.string({
            required_error: 'Please confirm your password',
        }),
    }),
    params: z.object({
        token: z.string(),
    }),
})

export type CreateUserType = z.infer<typeof userInputSchema>['body']
export type GetUserType = z.infer<typeof userInputSchema>['params']
export type LoginUserType = z.infer<typeof loginSchema>['body']
export type UpdateUserType = z.infer<typeof userInputSchema>['body']
export type UpdatePasswordType = z.infer<typeof updatePasswordSchema>['body']
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>['body']
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>
