document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const code = document.getElementById("code").value;
    const name = document.getElementById("name").value;
    const message = document.getElementById("message");

    if (code === "1234") {
        // Zuerst prüfen, ob der Name bereits existiert
        fetch('/namen')
            .then(response => response.json())
            .then(namenList => {
                if (namenList.includes(name)) {
                    message.textContent = "Der Name existiert bereits. Bitte wählen Sie einen anderen Namen.";
                } else {
                    // Name existiert noch nicht, Benutzer hinzufügen
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
                            message.innerHTML = `Willkommen, ${name}.<br>Warten bis das Spiel gestartet wird...`;
    
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
            })
            .catch(error => {
                console.error('Error:', error);
                message.textContent = "Ein Fehler ist aufgetreten.";
            });
    } else {
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
