import http from "http";
import express from "express";
import { Server } from "socket.io";
import fs from 'fs'

const app = express();

// const options = {
//   key: fs.readFileSync('./ssl/localhost.key'),
//   cert: fs.readFileSync('./ssl/localhost.crt')
// };

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

let onlineUsers = new Map();

io.on("connection", async (socket) => {
  console.log("Client is connected !");

  socket.on("add-user", (id) => {
    onlineUsers.set(id, socket.id);
    console.log(`User ${id} connected`);
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      
      if (value === socket.id) {
        onlineUsers.delete(key);
        console.log(`User ${key} disconnected`);
      }
    });
  });

});

export { app, io, server, onlineUsers }
