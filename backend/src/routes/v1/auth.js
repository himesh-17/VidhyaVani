import { Router } from 'express';
import * as authController from '../../controllers/authController.js';
import { authenticate } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import { registerValidation, loginValidation } from '../../utils/validators.js';

const router = Router();

// Public routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.getMe);

export default router;
