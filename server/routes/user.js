import express from 'express';
import { protect } from '../middlewares/auth.js';
import { getMe, updateProfile, getSettings, updateSettings, getDashboard, updateDashboard } from '../controllers/authController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/profile', getMe);
router.put('/profile', updateProfile);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/dashboard', getDashboard);
router.put('/dashboard', updateDashboard);

export default router;

 