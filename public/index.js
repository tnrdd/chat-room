const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const userUpdates = document.getElementById("updates");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("message", input.value);
    input.value = "";
  }
});

socket.on("message", (msg) => {
  const li = document.createElement("li");
  li.textContent = msg;
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
})

socket.on("enter", (user) => {
  userUpdates.textContent = `a new user joined the room`;
})

socket.on("exit", (user) => {
  userUpdates.textContent = `an user exit the room`;
})
