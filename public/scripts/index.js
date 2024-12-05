const form = document.querySelector("form");
const input = document.querySelector(".input");
const messages = document.querySelector(".messages");
const users = document.querySelector(".users");
const username = prompt("Please enter a username: ", "");
const socket = io();

addMessage("You have joined the chat as '" + username  + "'.");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    addMessage(username + ": " + input.value);

    socket.emit("chat_message", {
        message: input.value
    });

    input.value = "";
    return false;
}, false);

// send to server
socket.emit("user_join", username);
socket.emit("hello", "world");

// receive from server
socket.on("chat_message", (data) => {
    addMessage(data.username + ": " + data.message);
});

socket.on("user_join", (data) => {
    addMessage(data + " just joined the chat!");
});

socket.on("user_leave", (data) => {
    addMessage(data + " has left the chat.");
});

function addMessage(message) {
    const li = document.createElement("li");
    li.innerHTML = message;
    messages.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight);
}