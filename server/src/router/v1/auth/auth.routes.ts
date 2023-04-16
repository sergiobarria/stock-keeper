import express from 'express'

import { loginUserHandler, logoutUserHandler, registerUserHandler } from './auth.controller'
import { validate } from '../../../middlewares'
import { loginSchema, registerSchema } from './auth.schemas'

const router = express.Router()

router.route('/register').post(validate(registerSchema), registerUserHandler)
router.route('/login').post(validate(loginSchema), loginUserHandler)
router.route('/logout').get(logoutUserHandler)

export { router as authRouter }
