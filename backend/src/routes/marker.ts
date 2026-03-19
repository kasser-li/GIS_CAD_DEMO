import { Router } from 'express'
import { markerController } from '../controllers/markerController'

const router = Router()

router.post('/', markerController.create)
router.get('/', markerController.query)
router.put('/:id', markerController.update)
router.delete('/:id', markerController.delete)
router.post('/batch', markerController.import)
router.get('/export', markerController.export)

export default router
