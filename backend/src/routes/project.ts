import { Router } from 'express'
import { projectController } from '../controllers/projectController'

const router = Router()

router.post('/', projectController.create)
router.get('/', projectController.list)
router.get('/:id', projectController.get)
router.put('/:id', projectController.update)
router.delete('/:id', projectController.delete)

export default router
