import { Router } from 'express';
import { listProducts, createProduct } from '../controllers/product.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/')
  .get(listProducts)
  .post(protect, createProduct);   // only authenticated users

export default router;
