import { Router } from 'express';
import * as reviewController from '../../controllers/reviewController.js';
import { authenticate, isFaculty } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import { rejectValidation } from '../../utils/validators.js';

const router = Router();

// All routes require authentication and faculty/admin role
router.use(authenticate);
router.use(isFaculty);

router.get('/pending', reviewController.getPendingBlogs);
router.post('/:blogId/approve', reviewController.approveBlog);
router.post('/:blogId/reject', rejectValidation, validate, reviewController.rejectBlog);
router.get('/:blogId/history', reviewController.getReviewHistory);

export default router;
