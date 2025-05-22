import { Router } from 'express';
import { register, login, refreshToken, logout, updateUser, deleteUser } from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       201: { description: Registered }
 */
router.post('/register', register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200: { description: Logged in }
 */
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

router.put('/update', protect, updateUser);

router.delete('/delete', protect, deleteUser);

export default router;
