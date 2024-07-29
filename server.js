const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Klasse für Fragen mit 4 Auswahlmöglichkeiten
class FourC {
    constructor(question, ans_one, ans_two, ans_three, ans_four, correctAnswer) {
        this.question = question;
        this.ans_one = ans_one;
        this.ans_two = ans_two;
        this.ans_three = ans_three;
        this.ans_four = ans_four;
        this.correctAnswer = correctAnswer; // This should be an integer from 1 to 4
    }

    getFourC() {
        return {
            question: this.question,
            answers: [this.ans_one, this.ans_two, this.ans_three, this.ans_four]
        };
    }

    isCorrectAnswer(answer) {
        const answers = [this.ans_one, this.ans_two, this.ans_three, this.ans_four];
        return answers[this.correctAnswer - 1] === answer;
    }

    getExpectedAnswer() {
        return this.correctAnswer;
    }

    getCorrectAnswer() {
        const answers = [this.ans_one, this.ans_two, this.ans_three, this.ans_four];
        return answers[this.correctAnswer - 1];
    }
}

const questions = [
    new FourC("Was ist die Wurzel aus 121!", "11", "12 ", "13", "10", 1),
    new FourC("Was ist die Hauptstadt von Finnland?", "Oslo", "Helsinki", "Stockholm", "St. Petersburg", 2),
    new FourC("Wer ist der Kapitän der deutschen Nationalmanschaft?", "Kimmich", "Völler", "Can", "Gündogan", 4),
    new FourC("Wie heißt Davide mit Nachnamen?", "Avanzanto", "Müller", "Avanzato", "Yildiz", 3),
    new FourC("Wann war der 1. Weltkrieg?", "1914-1918", "1939-1945", "1900-1910", "1804-1809", 1)
];

function getQuestionsAndAnswers() {
    return questions.map(question => question.getFourC());
}

function getAnswers() {
    return questions.map(question => question.getExpectedAnswer());
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));

// Route, um die Fragen und Antworten zurückzugeben
app.get('/questions', (req, res) => {
    try {
        const result = getQuestionsAndAnswers();
        res.json(result);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

app.get('/answers', (req, res) => {
    try {
        const ans = getAnswers();
        res.json(ans);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

const jsonFilePath = path.join(__dirname, 'data.json');

// Route zum Abrufen der Namen
app.get('/namen', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Fehler beim Lesen der Datei:', err);
            return res.status(500).send('Interner Serverfehler');
        }

        try {
            const jsonData = JSON.parse(data);
            const namen = jsonData.map(entry => entry.name);
            res.json(namen);
        } catch (parseErr) {
            console.error('Fehler beim Parsen der JSON-Daten:', parseErr);
            res.status(500).send('Fehler beim Verarbeiten der Daten');
        }
    });
});

app.post('/namen', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Name ist erforderlich');
    }

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Fehler beim Lesen der Datei:', err);
            return res.status(500).send('Interner Serverfehler');
        }

        try {
            const jsonData = JSON.parse(data);
            const namen = jsonData.map(entry => entry.name);

            if (namen.includes(name)) {
                return res.status(400).json({ message: 'Name existiert bereits' });
            }

            jsonData.push({ name });
            fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error('Fehler beim Schreiben der Datei:', writeErr);
                    return res.status(500).send('Interner Serverfehler');
                }

                res.status(201).json({ message: 'Name erfolgreich hinzugefügt' });
            });
        } catch (parseErr) {
            console.error('Fehler beim Parsen der JSON-Daten:', parseErr);
            res.status(500).send('Fehler beim Verarbeiten der Daten');
        }
    });
});

app.post('/addUser', (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.json({ success: false, message: "Name ist erforderlich." });
    }

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Fehler beim Lesen der Datei:', err);
            return res.status(500).json({ success: false, message: "Fehler beim Lesen der Datei." });
        }

        let users;
        try {
            users = JSON.parse(data);
            if (!Array.isArray(users)) {
                users = [];
            }
        } catch (parseErr) {
            console.error('Fehler beim Parsen der JSON-Daten:', parseErr);
            return res.status(500).json({ success: false, message: "Fehler beim Parsen der JSON-Daten." });
        }

        users.push({ name: name, Punktzahl: 0, isActive: true });

        fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Fehler beim Schreiben der Datei:', err);
                return res.status(500).json({ success: false, message: "Fehler beim Schreiben der Datei." });
            }

            res.json({ success: true });
        });
    });
});

function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return [];
    }
}

// Function to write JSON data to a file
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

app.post('/add-points', (req, res) => {
    const { username, points } = req.body;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    if (typeof points !== 'number') {
        return res.status(400).send('Points should be a number');
    }

    // Read data from JSON file
    const players = readJsonFile(jsonFilePath);

    // Find the player by username
    const player = players.find(p => p.name === username);

    if (player) {
        // Update player's score
        player.Punktzahl += points;

        // Write updated data back to JSON file
        writeJsonFile(jsonFilePath, players);

        res.json({ success: true, message: `Points added. New score for ${username}: ${player.Punktzahl}` });
    } else {
        res.status(404).send('Player not found');
    }
});
  

let startApp = false;

app.get('/getstart', (req, res) => {
    res.send({ status: startApp });
});


app.post('/game', (req, res) => {
    if (req.body.action === 'setStatusTrue') {
        startApp = true;
        res.send({ message: 'Status wurde auf true gesetzt' });
    } else {
        res.status(400).send({ error: 'Ungültige Anfrage' });
    }
});


let start1 = false;
let start2 = false;
let start3 = false;
let start4 = false;
let start5 = false;
let callCount = 0;  // Zähler für die Anzahl der Aufrufe

// Endpoint to handle nextpage calls and update the status
app.get('/nextpagecall', (req, res) => {
    switch(callCount) {
        case 0:
            start1 = true;
            break;
        case 1:
            start2 = true;
            break;
        case 2:
            start3 = true;
            break;
        case 3:
            start4 = true;
            break;
        case 4:
            start5 = true;
            break;
        default:
            // Alle Status wurden bereits auf true gesetzt, nichts weiter zu tun
            res.send('All statuses are already set to true.');
            return;
    }

    callCount++;  // Zähler erhöhen

    res.send({
        message: 'Status updated',
        status1: start1,
        status2: start2,
        status3: start3,
        status4: start4,
        status5: start5
    });
});

// Endpoint to fetch the current status values
app.get('/nextpagefetch', (req, res) => {
    res.send({
        status1: start1,
        status2: start2,
        status3: start3,
        status4: start4,
        status5: start5
    });
});

// Serve static files from the root directory
app.use('/', express.static(path.join(__dirname, '/')));

// Serve static files from specific directories
app.use('/question', express.static(path.join(__dirname, '/Host/Game')));
app.use('/poll', express.static(path.join(__dirname, '/Host/Poll')));
app.use('/start', express.static(path.join(__dirname, '/Host/Start')));
app.use('/pw', express.static(path.join(__dirname, '/Host/PW')));

app.use('/login', express.static(path.join(__dirname, '/Player/Login')));
app.use('/game', express.static(path.join(__dirname, '/Player/Game2.0')));

//Question Routes
app.use('/game/Q1', express.static(path.join(__dirname, '/Player/Game2.0/Frage1')));
app.use('/game/Q2', express.static(path.join(__dirname, '/Player/Game2.0/Frage2')));
app.use('/game/Q3', express.static(path.join(__dirname, '/Player/Game2.0/Frage3')));
app.use('/game/Q4', express.static(path.join(__dirname, '/Player/Game2.0/Frage4')));
app.use('/game/poll', express.static(path.join(__dirname, '/Host/Poll')));


// Route for the root (login) page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start des Servers
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
