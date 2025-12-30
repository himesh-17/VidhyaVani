import { Router } from 'express';
import * as blogController from '../../controllers/blogController.js';
import { authenticate, optionalAuth } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import { blogValidation } from '../../utils/validators.js';

const router = Router();

// Public routes
router.get('/', blogController.getPublicBlogs);
router.get('/:slug', blogController.getBlogBySlug);

// Protected routes
router.post('/', authenticate, blogValidation, validate, blogController.createBlog);
router.get('/user/my-blogs', authenticate, blogController.getMyBlogs);
router.get('/edit/:id', authenticate, blogController.getBlogById);
router.put('/:id', authenticate, blogValidation, validate, blogController.updateBlog);
router.delete('/:id', authenticate, blogController.deleteBlog);
router.post('/:id/submit', authenticate, blogController.submitForReview);

export default router;
