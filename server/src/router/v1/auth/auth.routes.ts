import express from 'express'

import { registerUserHandler } from './auth.controller'
import { validate } from '../../../middlewares'
import { registerSchema } from './auth.schemas'

const router = express.Router()

router.route('/register').post(validate(registerSchema), registerUserHandler)

export { router as authRouter }
