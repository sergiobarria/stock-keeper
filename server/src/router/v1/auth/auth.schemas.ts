import { z } from 'zod'

export const registerSchema = z.object({
    body: z
        .object({
            email: z
                .string({
                    required_error: 'Email is required'
                })
                .email(),
            name: z
                .string({
                    required_error: 'Name is required'
                })
                .min(3)
                .max(20),
            password: z
                .string({
                    required_error: 'Password is required'
                })
                .min(8)
                .max(30),
            passwordConfirm: z
                .string({
                    required_error: 'Password confirmation is required'
                })
                .min(8)
                .max(30),
            photo: z.string().optional(),
            phone: z.string().optional(),
            bio: z.string().optional()
        })
        .refine(data => data.password === data.passwordConfirm, {
            message: 'Passwords do not match',
            path: ['passwordConfirm']
        })
})

export type RegisterUserInput = z.infer<typeof registerSchema>['body']
