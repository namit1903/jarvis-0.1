import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
// import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 3000;
//io is a server instance
//whiel socket is a connection instance between client and server
//each connected client gets a unique socket instance


const server = http.createServer(app);//created http server
const io = new Server(server, {//http server instance is passed as argument to 
    cors: {
        origin: '*'
    }
});
//io is an instance of socket.io which will be used to manage websocket connections.

// /middleware for  authenticated users 
// This middleware runs before the connection event is triggered, allowing you to inspect or modify the handshake information, perform authentication, or reject connections if necessary.
io.use(async (socket, next) => {//socket is automatically provided by Socket.IO for each connection attempt.

    try {
        // socket.handshake provides detailed information about the connection request that a client makes 
        // when establishing a WebSocket connection with the server.It contains metadata about the connection, such as headers, query parameters, cookies, and other connection details
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId->aisa koi project exist nahi krta'));
        }


        socket.project = await projectModel.findById(projectId);//socket.project is a custom property attached during the middleware.


        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // if (!decoded) {
        //     return next(new Error('Authentication error'))
        // }


        socket.user = decoded;

        next();

    } catch (error) {
        next(error)
    }

})


io.on('connection', socket => {
    socket.roomId = socket.project._id.toString()


    console.log('a user connected');

//roomId is The name of the room the socket will join. If the room doesn’t exist, it will be created automatically.

    socket.join(socket.roomId);

    socket.on('project-message', async data => {

        const message = data.message;

       
        socket.broadcast.to(socket.roomId).emit('project-message', data);
        // io.to(socket.roomId).emit('project-message', data);-->this will broadcast data to sender also
        // const aiIsPresentInMessage = message.includes('@ai');

        // if (aiIsPresentInMessage) {


        //     const prompt = message.replace('@ai', '');

        //     const result = await generateResult(prompt);


        //     io.to(socket.roomId).emit('project-message', {
        //         message: result,
        //         sender: {
        //             _id: 'ai',
        //             email: 'AI'
        //         }
        //     })


        //     return
        // }


    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(socket.roomId)
    });
});




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})