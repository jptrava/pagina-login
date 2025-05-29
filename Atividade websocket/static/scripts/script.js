const socket = io();
let username = "";

while (!username) {
    username = prompt("Digite seu nome:");
    if (!username || username.trim().length === 0) username = "";
}

const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const form = document.getElementById("form");
const themeToggleBtn = document.getElementById("themeToggleBtn");


function getInitials(name) {
    const names = name.trim().split(' ');
    if (names.length === 1) {
        return names[0][0].toUpperCase();
    } else {
        return (names[0][0] + names[1][0]).toUpperCase();
    }
}

form.addEventListener("submit", function () {
    const msg = input.value.trim();
    if (msg) {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        socket.emit("send_message", {
            username: username,
            message: msg,
            time: time
        });
        input.value = "";
    }
});

socket.on("receive_message", function (data) {
    const container = document.createElement("div");
    container.classList.add("message-container");

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    const timeTag = `<div class="time">${data.time}</div>`;

    if (data.username === username) {
        messageDiv.classList.add("me");
        messageDiv.innerHTML = `${data.message}${timeTag}`;
        container.style.justifyContent = "flex-end";
        container.appendChild(messageDiv);
    } else {
        messageDiv.classList.add("other");

        const avatar = document.createElement("div");
        avatar.classList.add("avatar");
        avatar.textContent = getInitials(data.username);

        messageDiv.innerHTML = `<span class="sender">${data.username}</span>${data.message}${timeTag}`;

        container.appendChild(avatar);
        container.appendChild(messageDiv);
        container.style.justifyContent = "flex-start";
    }

    chat.appendChild(container);
    chat.scrollTop = chat.scrollHeight;
});


themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")) {
        themeToggleBtn.textContent = "Modo Claro";
    } else {
        themeToggleBtn.textContent = "Modo Escuro";
    }
});
