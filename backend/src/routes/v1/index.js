import { Router } from 'express';
import authRoutes from './auth.js';
import blogRoutes from './blogs.js';
import reviewRoutes from './reviews.js';
import eventRoutes from './events.js';
import userRoutes from './users.js';
import uploadRoutes from './upload.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/reviews', reviewRoutes);
router.use('/events', eventRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;
