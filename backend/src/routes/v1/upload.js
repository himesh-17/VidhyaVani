
import express from 'express';
import { uploadImage } from '../../controllers/uploadController.js';
import { authenticate as protect } from '../../middleware/auth.js'; // Assuming auth middleware exists

const router = express.Router();

router.post('/', protect, uploadImage);

export default router;
