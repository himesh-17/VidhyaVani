import { Router } from 'express';
import * as eventController from '../../controllers/eventController.js';
import { authenticate, isFaculty } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import { eventValidation } from '../../utils/validators.js';

const router = Router();

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);

// Protected routes (Faculty, Admin)
router.post('/', authenticate, isFaculty, eventValidation, validate, eventController.createEvent);
router.put('/:id', authenticate, isFaculty, eventValidation, validate, eventController.updateEvent);
router.delete('/:id', authenticate, isFaculty, eventController.deleteEvent);

export default router;
