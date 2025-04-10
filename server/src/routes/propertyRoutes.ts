import express from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
} from '../controllers/propertyControllers';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.get('/', getProperties);
router.get('/:id', getProperty);
router.post(
  '/',
  authMiddleware(['manager']),
  upload.array('photos'),
  createProperty
);

export default router;
