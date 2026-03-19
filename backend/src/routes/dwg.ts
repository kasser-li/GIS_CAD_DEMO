import { Router } from 'express'
import { dwgController } from '../controllers/dwgController'

const router = Router()

router.post('/upload', dwgController.upload, dwgController.create)
router.get('/:id', dwgController.get)
router.post('/:id/parse', dwgController.parse)
router.get('/:id/layers', dwgController.getLayers)
router.delete('/:id', dwgController.delete)

export default router
