import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';


export const createUserController = async (req, res) => {
        
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);
        console.log(user); // The password field will be excluded by default

        const token = await user.generateJWT();

        delete user._doc.password;

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');
        /*.select('+password'): This tells Mongoose to include the password field in the result. By default, Mongoose excludes the password field from queries for security reasons, so using .select('+password') explicitly includes it.*/

        if (!user) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                errors: 'Invalid credentials-->check ur password'
            })
        }

        const token = await user.generateJWT();

        delete user._doc.password;//This line removes the password field from the user object before returning it, particularly when sending a response to the client

        res.status(200).json({ user, token });


    } catch (err) {

        console.log(err);

        res.status(400).send(err.message);
    }
}

export const profileController = async (req, res) => {

    res.status(200).json({
        user: req.user
    });

}
//logout controller......
export const logoutController = async (req, res) => {
    try {

        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];//token hi extract kr rhe hai

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);//blacklisting the token

        res.status(200).json({
            message: 'Logged out successfully'
        });


    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {

        console.log(err)

        res.status(400).json({ error: err.message })

    }
}