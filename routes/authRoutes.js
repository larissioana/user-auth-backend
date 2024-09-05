import { signup, signin, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post("/register", signup);
router.post("/login", signin);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, upload.single('profileImage'), updateUserProfile);

export default router;