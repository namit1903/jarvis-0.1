import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
// the body functions is used to validate and sanitize the input fields
const router = Router();

//brfore passing to the controllers pass the array of validation middleware to the route

router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.createUserController);

router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.loginController);

router.get('/profile', authMiddleware.authUser, userController.profileController);


// router.get('/logout', authMiddleware.authUser, userController.logoutController);


// router.get('/all', authMiddleware.authUser, userController.getAllUsersController);


export default router;