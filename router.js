const express = require('express');
const path = require('path');
const USER = require('./models/user.js');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await USER.findOne({ 'user.username': username });
    if (!user) {
        return res.status(400).send('Benutzer nicht gefunden');
    }

    if (password !== user.user.password) {
        return res.status(400).send('Ungültiges Passwort');
    }

    res.send('Erfolgreich eingeloggt');
});


module.exports = router;