const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(`${__dirname}/public`));

const users = [];

io.on("connection", (socket) => {
  socket.on("message", (payload) => {
    io.emit("message", { nickname: payload.nickname, msg: payload.msg });
  });
  socket.on("login", (nickname) => {
    if (users.includes(nickname)) {
      socket.emit("taken", "This nickname is already taken");
    } else {
      users.push(nickname);
      socket.nickname = nickname;
      io.emit("enter", nickname);
    }
  });
  socket.on("typing", (isTyping) => {
    if (isTyping) {
      io.emit("typing", socket.nickname);
    } else {
      io.emit("typing", null);
    }
  });
  socket.on("disconnect", () => {
    users.splice(users.indexOf(socket.nickname, 1));
    if (socket.nickname) {
      io.emit("exit", socket.nickname);
    }
  });
});

server.listen(3000, () => {
  console.log("listening on port:3000");
});
