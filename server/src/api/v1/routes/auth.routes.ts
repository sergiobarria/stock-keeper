import express from 'express'

import * as authController from '@/api/v1/controllers/auth.controller'
import { validate } from '@/middlewares'
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    updatePasswordSchema,
} from '@/api/v1/schemas/user.schemas'
import { authenticate } from '@/middlewares/authenticate.middleware'

const router = express.Router()

router.route('/register').post(validate(registerSchema), authController.registerHandler)
router.route('/login').post(validate(loginSchema), authController.loginHandler)
router.route('/logout').get(authController.logoutHandler)
router.route('/forgot-password').post(validate(forgotPasswordSchema), authController.forgotPasswordHandler)
router.route('/reset-password/:token').patch(validate(resetPasswordSchema), authController.resetPasswordHandler)
router
    .route('/update-password')
    .patch(authenticate, validate(updatePasswordSchema), authController.updatePasswordHandler)

export { router as authRouter }
