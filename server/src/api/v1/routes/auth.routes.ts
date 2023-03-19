import express from 'express'

import * as authController from '@/api/v1/controllers/auth.controller'
import { validate } from '@/middlewares'
import { loginSchema, registerSchema } from '@/api/v1/schemas/user.schemas'

const router = express.Router()

router.route('/register').post(validate(registerSchema), authController.registerHandler)
router.route('/login').post(validate(loginSchema), authController.loginHandler)
router.route('/logout').get(authController.logoutHandler)

export { router as authRouter }
