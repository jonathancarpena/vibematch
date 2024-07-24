import { Router } from 'express'

const router = Router()

import { getUsers, createUser } from '../controllers/userController.js'

router.get('/', getUsers)
router.post('/', createUser)

export default router
