document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const code = document.getElementById("code").value;
    const name = document.getElementById("name").value;
    const message = document.getElementById("message");

    if (code === "56794") {
        fetch('/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                message.textContent = `Willkommen, ${name}!`;
                setTimeout(() => {
                    window.location.href = "https://www.dhbw-mannheim.de";  // Hier die Zielseite nach dem Login angeben
                }, 2000); // Wartezeit von 2 Sekunden bevor die Weiterleitung erfolgt
            } else {
                message.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            message.textContent = "Ein Fehler ist aufgetreten.";
        });
    } else {
        message.textContent = "Falscher Code. Zugriff verweigert.";
    }
});
