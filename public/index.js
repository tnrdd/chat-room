const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const error = document.getElementById("error");
const messages = document.getElementById("messages");
const userUpdates = document.getElementById("updates");

let nickname = "";
let isLoggedIn = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    if (isLoggedIn) {
      socket.emit("message", { nickname: nickname, msg: input.value });
      input.value = "";
    } else {
      socket.emit("login", input.value);
      nickname = input.value;
      input.value = "";
      input.placeholder = "";
    }
  }
});

socket.on("message", (payload) => {
  const li = document.createElement("li");
  li.textContent = `${payload.nickname}: ${payload.msg}`;
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("enter", (user) => {
  if (user === nickname) {
    isLoggedIn = true;
  }
  error.style.display = "none";
  userUpdates.textContent = `${user} joined the room`;
});

socket.on("taken", (err) => {
  error.style.display = "block";
  error.textContent = err;
});

socket.on("exit", (nickname) => {
  userUpdates.textContent = `${nickname} has exited the room`;
});
