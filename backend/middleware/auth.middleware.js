import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
//also check if the token is blacklisted or not

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
        console.log("here is your token",token);
        if (!token) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const isBlackListed = await redisClient.get(token);//do not authorize this token

        if (isBlackListed) {

            res.cookie('token', '');//empty token value in cookie

            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;//first decoded the token and then stored user information within request
        next();
    } catch (error) {

        console.log(error);

        res.status(401).send({ error: 'Unauthorized User' });
    }
}