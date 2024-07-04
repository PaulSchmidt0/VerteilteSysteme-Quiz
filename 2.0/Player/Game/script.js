let testans = null; // Initialisiert testans mit null, bis die Antwort geladen wird
let time = 10;
let answer = 0;
let user_interaction = false;
let start = true;

// Funktion zum Laden der Antworten von http://localhost:3000/answers
function loadAnswers() {
    fetch('http://localhost:3000/answers')
        .then(response => response.json())
        .then(data => {
            // Annahme: data ist ein Array von Antworten, hier nehmen wir die erste Antwort
            testans = data[0]; // Nehmen Sie hier die erste Antwort aus dem Array
            console.log('Loaded testans:', testans);

            // Nach dem Laden der Antwort starten wir das Quiz
            startQuiz();
        })
        .catch(error => {
            console.error('Error loading answers:', error);
        });
}

// Funktion zum Starten des Timers und der UI-Initialisierung
function startQuiz() {
    if (start) {
        const duration = time;
        const progressBar = document.getElementById('progress-bar');
        startTimer(duration, progressBar);
    }
}

// Event-Listener für den Button zum Laden der Frage und Antwort
document.addEventListener('DOMContentLoaded', (event) => {
    const loadAnswerButton = document.getElementById('loadAnswerButton');
    if (loadAnswerButton) {
        loadAnswerButton.addEventListener('click', () => {
            // Laden der Antworten von http://localhost:3000/answers
            loadAnswers();
        });
    }
});

// Funktion zum Expandieren der Antwort-Box und zur Interaktion des Benutzers
function expandBox(self, selectedAnswer) {
    answer = selectedAnswer;
    user_interaction = true;
    var box1 = document.getElementById('answer');
    var otherBoxes = document.querySelectorAll('#Box1, #Box2, #Box3, #Box4');

    if (!box1.classList.contains('expanded')) {
        box1.classList.add('expanded');
        otherBoxes.forEach(box => box.classList.add('hidden'));
        showLoader(box1);
    }
}

// Funktion zum Anzeigen des Ladensymbols
function showLoader(box) {
    var loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="ball"></div><div class="ball"></div><div class="ball"></div>';

    box.innerHTML = '';
    box.appendChild(loader);
}

// Timer-Funktion
function startTimer(duration, progressBar) {
    let width = 100;
    let timeLeft = duration;
    const updateRate = 10;
    let lastUpdateTime = Date.now();

    function update() {
        const now = Date.now();
        const elapsed = (now - lastUpdateTime) / 1000; // Convert ms to seconds
        timeLeft -= elapsed;
        width = (timeLeft / duration) * 100;
        progressBar.style.width = width + '%';
        lastUpdateTime = now;

        if (timeLeft <= 0) {
            clearInterval(interval);
            document.querySelectorAll('.loader').forEach(loader => loader.style.display = 'none');

            if (!user_interaction) {
                // No answer chosen, expand box and show "falsch"
                expandBox(null, 0); // Expand box with default incorrect answer
            }

            // Always call showTextAfterLoader after clearing loader and handling user_interaction
            showTextAfterLoader(answer, testans); // Pass answer and testans
        } else {
            requestAnimationFrame(update);
        }
    }

    const interval = setInterval(() => {
        if (document.hidden) {
            // Tab is hidden, don't update the progress
            clearInterval(interval);
        } else {
            // Tab is visible, continue updating the progress
            update();
        }
    }, updateRate);
}

// Funktion zum Anzeigen des Ergebnistextes basierend auf der Antwort
function showTextAfterLoader(answer, testans) {
    var box1 = document.getElementById('answer');
    var message;

    if (answer === testans) {
        message = '<div class="customMessage">richtig</div>';
        addPoints(username, 1); // Add points only when the answer is correct
    } else {
        message = '<div class="customMessage">falsch</div>';
    }

    // Update the box content with the determined message
    box1.innerHTML = message;
}

// Funktion zum Hinzufügen von Punkten über einen POST-Request
function addPoints(username, points) {
    if (!pointsAdded) {
        fetch('/add-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, points })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
}

// Abrufen des Benutzernamens aus dem localStorage und Anzeigen in der UI, falls verfügbar
const username = localStorage.getItem('username');
if (username) {
    document.getElementById('name').textContent = `${username}`;
    console.log(username);
}
