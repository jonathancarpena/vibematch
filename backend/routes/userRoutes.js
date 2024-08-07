import { Router } from 'express'

const router = Router()

import { getUsers, createUser } from '../controllers/userController.js'

//@desc     GET all users
//@route    GET /api/users/allUsers
router.get('/', getUsers)

//@desc     POST create user
//@route    POST /api/users/
router.post('/', createUser)

export default router
