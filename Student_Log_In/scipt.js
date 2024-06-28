document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const code = document.getElementById("code").value;
    const name = document.getElementById("name").value;
    const message = document.getElementById("message");

    if (code === "56794") {
        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(user => user.name === name)) {
            message.textContent = "Dieser Name ist bereits vergeben. Bitte wählen Sie einen anderen Namen.";
        } else {
            users.push({ name });
            localStorage.setItem('users', JSON.stringify(users));
            message.textContent = `Willkommen, ${name}!`;
        }
    } else {
        message.textContent = "Falscher Code. Zugriff verweigert.";
    }
});
