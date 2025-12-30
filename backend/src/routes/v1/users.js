import { Router } from 'express';
import * as userController from '../../controllers/userController.js';
import { authenticate, isAdmin } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import { roleChangeValidation, statusOverrideValidation } from '../../utils/validators.js';

const router = Router();

// Protected profile route (any authenticated user)
router.put('/profile', authenticate, userController.updateProfile);

// Admin-only routes
router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/stats', authenticate, isAdmin, userController.getDashboardStats);
router.get('/blogs', authenticate, isAdmin, userController.getAllBlogs);
router.get('/:id', authenticate, isAdmin, userController.getUser);
router.put('/:id/role', authenticate, isAdmin, roleChangeValidation, validate, userController.changeUserRole);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);
router.put('/blogs/:id/status', authenticate, isAdmin, statusOverrideValidation, validate, userController.overrideBlogStatus);

export default router;
