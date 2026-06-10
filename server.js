import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User ${socket.id} joined room ${data}`);
    });

    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
});
