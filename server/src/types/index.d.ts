import type { UserModel } from '@/api/v1/models/user.model'

// Extend global express Request object
declare global {
    namespace Express {
        export interface Request {
            user: UserModel
        }
    }
}
