import 'dotenv/config'
import Redis from 'ioredis';// for python we use redis-py
//redis is a library
//redis client provides interface fro interacting with aredis server using programming languages like JS,python,java
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});


redisClient.on('connect', () => {
    console.log('Redis connected');
})
//events=> connect,error,ready
//redis client listens to one of these events and act accordingly

export default redisClient; 