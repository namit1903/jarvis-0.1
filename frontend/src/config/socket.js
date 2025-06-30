// 
import socket from 'socket.io-client';

let socketInstance = null;

// Initialize Socket Connection
export const initializeSocket = (projectId) => {
    // Ensure VITE_API_URL is available and valid
    if (!import.meta.env.VITE_API_URL) {
        throw new Error('VITE_API_URL is not defined in the environment variables');
    }

    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: sessionStorage.getItem('token') // Ensure the token is present
        },
        query: {
            projectId // The query is passed to the server
        }
    });

    // Event for successful connection
    socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
    });

    // Handle connection errors
    socketInstance.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
    });

    // Handle disconnection
    socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    return socketInstance;
};

// Listen for messages from the server
export const receiveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    } else {
        console.warn('Socket not initialized');
    }
};

// Send messages to the server
export const sendMessage = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    } else {
        console.warn('Socket not initialized');
    }
};

// Optional: Clean up socket when no longer needed
export const closeSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};
export const removeMessageListener = (eventName, cb) => {
  if (socketInstance) {
    socketInstance.off(eventName, cb);
  }
};
