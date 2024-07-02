const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const JSON_FILE = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Damit die statischen Dateien (HTML, JS) bedient werden können

// Lade Benutzer aus der JSON-Datei
const loadUsers = () => {
    if (fs.existsSync(JSON_FILE)) {
        const data = fs.readFileSync(JSON_FILE);
        return JSON.parse(data);
    }
    return [];
};

// Speichere Benutzer in die JSON-Datei
const saveUsers = (users) => {
    fs.writeFileSync(JSON_FILE, JSON.stringify(users, null, 4));
};

// API-Endpunkt zum Hinzufügen eines neuen Benutzers
app.post('/addUser', (req, res) => {
    const users = loadUsers();
    const { name } = req.body;

    if (users.some(user => user.name === name)) {
        return res.json({ success: false, message: "Dieser Name ist bereits vergeben." });
    }

    // Neuer Benutzer mit Punktzahl und Aktivitätsstatus
    const newUser = {
        name: name,
        Punktzahl: 0,
        isActive: true
    };

    users.push(newUser);
    saveUsers(users);
    res.json({ success: true });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
