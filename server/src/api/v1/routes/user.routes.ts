import express from 'express'

import * as userController from '../controllers/user.controller'
import { authenticate } from '@/middlewares/authenticate.middleware'

const router = express.Router()

router.route('/update-me').patch(authenticate, userController.updateMeHandler)
router.route('/').get(userController.getUsersHandler)
router.route('/:id').get(authenticate, userController.getUserHandler)

export { router as userRouter }
