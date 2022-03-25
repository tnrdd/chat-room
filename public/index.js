const form = document.getElementById("form");
const input = document.getElementById("input");
const error = document.getElementById("error");
const messages = document.getElementById("messages");
const updates = document.getElementById("updates");
const typing = document.getElementById("typing");

const socket = io();

let nickname;
let timeout;
let isLoggedIn = false;

function handleTimeout() {
  socket.emit("typing", false);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    if (isLoggedIn) {
      socket.emit("message", { nickname: nickname, msg: input.value });
    } else {
      socket.emit("login", input.value);
      nickname = input.value;
      input.placeholder = "";
    }
    input.value = "";
  }
});

input.addEventListener("keyup", () => {
  if (isLoggedIn) {
    socket.emit("typing", true);
    clearTimeout(timeout);
    timeout = setTimeout(handleTimeout, 3000);
  }
});

socket.on("message", (payload) => {
  const div = document.createElement("div");
  const name = document.createElement("span");
  const msg = document.createElement("span");
  div.className = "message";
  name.textContent = `${payload.nickname}: `;
  name.style.color = "#457b9d";
  name.style.fontWeight = "bold";
  msg.textContent = payload.msg;
  div.appendChild(name);
  div.appendChild(msg);
  messages.appendChild(div);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("enter", (user) => {
  if (user === nickname) {
    isLoggedIn = true;
  }
  updates.textContent = `${user} joined the room`;
  error.style.display = "none";
});

socket.on("taken", (err) => {
  error.style.display = "block";
  error.textContent = err;
});

socket.on("exit", (nickname) => {
  updates.textContent = `${nickname} has exited the room`;
});

socket.on("typing", (nickname) => {
  if (nickname) {
    typing.textContent = `${nickname} is typing...`;
  } else {
    typing.textContent = "";
  }
});
