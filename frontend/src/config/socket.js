import socket from 'socket.io-client';


let socketInstance = null;


export const initializeSocket = (projectId) => {
//create a socket instance
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {//then in the server side it is accesed using socket.handshake.auth
            token: localStorage.getItem('token')
        },
        query: {
            projectId//then in the server side it is accesed using socket.handshake.query
        }
    });

    return socketInstance;

}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
}