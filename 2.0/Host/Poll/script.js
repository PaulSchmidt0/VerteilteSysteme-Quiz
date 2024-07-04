document.addEventListener('DOMContentLoaded', () => {
    fetch('../../data.json')
        .then(response => response.json())
        .then(data => {
            // Sortiere die Daten nach Punktzahl
            data.sort((a, b) => b.Punktzahl - a.Punktzahl);

            // Erstelle die HTML-Inhalte
            const pollContainer = document.getElementById('poll');
            data.forEach(item => {
                const pollItem = document.createElement('div');
                pollItem.className = 'poll-item';
                pollItem.innerHTML = `<span>${item.name}</span><span>${item.Punktzahl}</span>`;
                pollContainer.appendChild(pollItem);
            });
        })
        .catch(error => console.error('Fehler beim Laden der Daten:', error));
});
