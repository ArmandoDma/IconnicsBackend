// routes/ZonasDeportivas.routes.js
import { Router } from 'express';
import {
  getZonasDeportivas,
  getZonasDeportivaById,
  createZonasDeportiva,
  updateZonasDeportiva,
  deleteZonasDeportiva
} from '../controllers/ZonasDeportivasController.js';

const router = Router();

router.get('/', getZonasDeportivas);
router.get('/:id', getZonasDeportivaById);
router.post('/', createZonasDeportiva);
router.put('/:id', updateZonasDeportiva);
router.delete('/:id', deleteZonasDeportiva);

export default router;
