import { Router } from 'express';
import { register, login, refreshToken, logout, updateUser, deleteUser } from '../controllers/auth.controller.js';
import {protect, authRateLimiter } from '../middlewares/auth.middleware.js';

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
router.post('/register', authRateLimiter, register);

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
router.post('/login',authRateLimiter, login);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Get new access and refresh tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *     responses:
 *       200:
 *         description: New tokens issued
 */
router.post('/refresh-token',authRateLimiter, refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout the current user and invalidate refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout',authRateLimiter, logout);

/**
 * @swagger
 * /api/v1/auth/update:
 *   put:
 *     summary: Update the currently logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/update',authRateLimiter, protect, updateUser);

/**
 * @swagger
 * /api/v1/auth/delete:
 *   delete:
 *     summary: Delete the currently logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/delete',authRateLimiter, protect, deleteUser);

export default router;
