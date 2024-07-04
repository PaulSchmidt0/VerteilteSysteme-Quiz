document.addEventListener('DOMContentLoaded', () => {
    const fetchNamen = () => {
        fetch('/namen')
            .then(response => response.json())
            .then(namen => {
                const spielerListe = document.getElementById('spielerListe');
                spielerListe.innerHTML = ''; // Vorherige Einträge löschen
                namen.forEach(name => {
                    const li = document.createElement('li');
                    li.textContent = name;
                    spielerListe.appendChild(li);
                });
            })
            .catch(error => console.error('Fehler beim Abrufen der Namen:', error));
    };

    // Initiales Laden der Namen
    fetchNamen();

    // Aktualisierungsintervall (z.B. alle 5 Sekunden)
    setInterval(fetchNamen, 5000);

    // Event-Listener für den Button hinzufügen
    document.getElementById('sButton').addEventListener('click', async function() {
        try {
            const response = await fetch('/Game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'setStatusTrue' })
            });
            const data = await response.json();
            console.log(data); // Log the response from the server
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Event-Listener für den Namen hinzufügen Button
    document.getElementById('addNameButton').addEventListener('click', async function() {
        const nameInput = document.getElementById('nameInput').value;
        try {
            const response = await fetch('/namen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: nameInput })
            });
            const data = await response.json();
            console.log(data); // Log the response from the server
            if (response.ok) {
                fetchNamen(); // Namenliste aktualisieren
            } else {
                alert(data.message); // Fehlermeldung anzeigen
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function Button() {
    window.location.href = '/question';
}