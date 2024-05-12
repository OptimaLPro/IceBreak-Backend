import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server);

export const socketSettings = () => {
    console.log("Socket server is running");

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle room creation
        socket.on('createRoom', (roomData) => {
            const { roomId, playerName } = roomData;
            // Create a new room with the given roomId and playerName
            socket.join(roomId);
            // Emit an event to confirm room creation
            socket.emit('roomCreated', roomId);
        });

        // Handle joining a room
        socket.on('joinRoom', (roomData) => {
            const { roomId, playerName } = roomData;
            // Join the specified room
            socket.join(roomId);
            // Emit an event to confirm joining the room
            socket.emit('roomJoined', roomId);
            // Broadcast to others in the room that a new player has joined
            socket.to(roomId).emit('playerJoined', playerName);
        });

        // Handle game actions
        socket.on('gameAction', (actionData) => {
            const { roomId, action } = actionData;
            // Broadcast the game action to all players in the room
            io.to(roomId).emit('gameAction', action);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

};