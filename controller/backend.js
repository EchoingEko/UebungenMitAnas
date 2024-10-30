const User = require('../models/user.js');
const Transaction = require('../models/transactions.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;



exports.backendLogin = async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        

        if (!username || !password) {
            return res.status(400).send('Benutzername und Passwort sind erforderlich');
        }

        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if (!user) {
            return res.status(400).send('Benutzer nicht gefunden');
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.user = { id: user._id, username: user.username, role: user.role };
            res.redirect('/');
        } else {
            res.status(400).send('Falsches Passwort');
        }
    } catch (err) {
        console.error('Fehler beim Login:', err);
        res.status(500).send('Interner Serverfehler');
    }
};


exports.backendRegistration = async function createUser(req, res) {
    try {
        const htmlBackToLogin = '<br><a href="/login">Jetzt Einloggen!</a>';
        const htmlBackToRegister = '<br><a href="/registrieren">Zurück zum Registrieren?</a>';
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).send('Benutzername, Passwort und E-Mail sind erforderlich' + htmlBackToRegister);
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Benutzername bereits vergeben' + htmlBackToRegister);
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            password: hashedPassword,
            email 
        });

        await newUser.save();
        res.status(200).send('Erfolgreich registriert: ' + newUser.username + htmlBackToLogin);
    } catch (err) {
        console.error('Fehler bei der Registrierung:', err);
        res.status(500).send('Interner Serverfehler');
    }
};

exports.editOrUpdateUser = async function editOrUpdateUser(req, res) {
    const userId = req.params.id;

    if (req.method === 'GET') {
        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send('Benutzer nicht gefunden');
            }

            res.send(`
                <h1>Benutzerdetails bearbeiten</h1>
                <form action="/update/${user._id}" method="POST">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" value="${user.username}" required>
                    <br>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password">
                    <br>
                    <button type="submit">Änderungen speichern</button>
                </form>
                <a href="/">Zurück zur Startseite</a>
            `);
        } catch (error) {
            console.error('Fehler beim Abrufen des Benutzers:', error);
            res.status(500).send('Interner Serverfehler');
        }
    } else if (req.method === 'POST') {
        try {
            const { username, password } = req.body;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send('Benutzer nicht gefunden');
            }
            if (password && password.trim() !== "") {
                const saltRounds = 10;
                user.password = await bcrypt.hash(password, saltRounds);
            }
            user.username = username;

            await user.save();

            res.redirect('/');
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Benutzers:', error);
            res.status(500).send('Interner Serverfehler');
        }
    }
};

exports.addUser = async function addUser(req, res) {
    try {
        const { username, password, email } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email,
            role: 'user'
        });

        await newUser.save();

        res.redirect('/');
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Benutzers:', error);
        res.status(500).send('Interner Serverfehler');
    }
};


exports.tableEJS = async function dataTable(req, res) {
    const user = req.session.user || null;

    if (user) {
        try {
            const users = await User.find();
            res.render('table', { users, user });
        } catch (error) {
            console.error('Fehler beim Abrufen der Benutzer:', error);
            res.status(500).send('Interner Serverfehler');
        }
    } else {
        res.redirect('/login');
    }
};

exports.backendLogout = function userLogout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error('Fehler beim Zerstören der Sitzung:', err);
            return res.status(500).send('Interner Serverfehler');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};