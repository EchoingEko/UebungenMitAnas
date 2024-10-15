const express = require('express');
const path = require('path');
const USER = require('./models/user.js');
const router = express.Router();
//const backend = require('./controllers/backend.js')

module.exports = function () {
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

router.post('/login', async (req, res) => {
backend.backenLogin(req, res);
    
  /*  const { username, password } = req.body;

    const user = await USER.findOne({ 'user.username': username });
    if (!user) {
        return res.status(400).send('Benutzer nicht gefunden');
    }

    if (password !== user.user.password) {
        return res.status(400).send('Ungültiges Passwort');
    }

    res.send('Erfolgreich eingeloggt');*/
});


  return router;
};
