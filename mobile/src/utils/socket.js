import { io } from 'socket.io-client';

const SOCKET_URL = 'http://10.0.2.2:5000';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, { transports: ['websocket'] });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
