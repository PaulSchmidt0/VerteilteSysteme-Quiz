document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const code = document.getElementById("code").value;
    const name = document.getElementById("name").value;
    const message = document.getElementById("message");

    if (code === "1234") {

            localStorage.setItem('username', name);

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

                    // Funktion zum Überprüfen des Status in Intervallen aufrufen
                    checkStatusInterval();
                } else {
                    message.textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                message.textContent = "Ein Fehler ist aufgetreten.";
            });
        }

    else {
            message.textContent = "Falscher Code. Zugriff verweigert.";
    }

});

function checkStatusInterval() {
    const interval = setInterval(() => {
        fetch('/getstart')
            .then(response => response.json())
            .then(data => {
                if (data.status === true) {
                    clearInterval(interval); // Stoppe das Intervall
                    window.location.href = "/game"; // Navigiere zur Zielseite
                }
            })
            .catch(error => {
                console.error('Fehler beim Abrufen von /getstart:', error);
            });
    }, 3000); // Überprüfe alle 3 Sekunden (3000 Millisekunden)
}
