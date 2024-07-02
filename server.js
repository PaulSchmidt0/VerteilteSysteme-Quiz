const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Klasse für Fragen mit 4 Auswahlmöglichkeiten
class fourC {
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
        // Map the correctAnswer index to the corresponding answer
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
    new fourC("Was ist die Hauptstadt von Deutschland?", "Monnem", "Madrid", "Berlin", "Käfertal", 3),
    new fourC("Wie viel Zeit habe ich mit diesem Projekt verschwendet?", "Gar keine", "viel zu viel", "ein wenig", "kaum", 2)
];

function getQuestionsAndAnswers() {
    return questions.map(question => question.getFourC());
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

// Route zum Speichern der Spielerdaten in der Session
app.post('/start', (req, res) => {
    const { name, points, isActive } = req.body;
    req.session.player = { name, points, isActive };
    res.send('Player data saved successfully');
});

// Route zum Abrufen der Spielerdaten aus der Session
app.get('/start', (req, res) => {
    if (req.session.player) {
        res.json(req.session.player);
    } else {
        res.status(404).send('No player data found');
    }
});

// Serve static files from the root directory
app.use('/', express.static(path.join(__dirname, '/')));

// Serve static files from specific directories
app.use('/question', express.static(path.join(__dirname, '/Host/Game')));
app.use('/poll', express.static(path.join(__dirname, '/Host/Poll')));
app.use('/start', express.static(path.join(__dirname, '/Host/Start')))

// Route for the root (login) page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start des Servers
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
