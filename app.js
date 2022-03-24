const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(`${__dirname}/public`));

io.on("connection", (socket) => {
  io.emit("enter");
  socket.on("message", (msg) => {
    io.emit("message", msg);
  });
  socket.on("disconnect", () => {
    io.emit("exit");
  });
});

server.listen(3000, () => {
  console.log("listening on port:3000");
});
