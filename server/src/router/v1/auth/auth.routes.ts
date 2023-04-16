import express from 'express'

import { loginUserHandler, registerUserHandler } from './auth.controller'
import { validate } from '../../../middlewares'
import { loginSchema, registerSchema } from './auth.schemas'

const router = express.Router()

router.route('/register').post(validate(registerSchema), registerUserHandler)
router.route('/login').post(validate(loginSchema), loginUserHandler)

export { router as authRouter }
