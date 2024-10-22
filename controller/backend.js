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

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Benutzer nicht gefunden');
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.status(200).send('Login erfolgreich');
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
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('Benutzername und Passwort sind erforderlich');
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Benutzername bereits vergeben');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(200).send('Erfolgreich registriert: ' + newUser.username);
    } catch (err) {
        console.error('Fehler bei der Registrierung:', err);
        res.status(500).send('Interner Serverfehler');
    }
};




// exports.backendLogin = async function (req, res) {

//     const { username, password } = req.body;
//     //console.log(username, password);
//     const findAllUsers = await User.find();
//     //console.log(findAllUsers);
//     const user = await User.findOne({ username: username });
//     if (!user) {
//         console.log("1");
//         return res.status(400).send('Benutzer nicht gefunden');
//     }
//     if (password !== user.password) {
//         console.log("2");
//         return res.status(400).send('Ungültiges Passwort');
//     }

//     res.send('Erfolgreich eingeloggt');
// };

// exports.backendLogin = async function (req, res) {
// // DB abfragen
// try{
//  const access = await User.findOne({ username: req.body.username, password:req.body.password  });
//     if (!access || access.role !== 'admin') {
//       return res.redirect('/');
//     }
//   const insertInTrans = new Transaction({
//       action: 'Backend',
//       login: req.body.username,
//     });
// await insertInTrans.save();

// if (access.role === 'admin') {
//       req.session.permission = 'admin';
//       req.session.user = access;
//       res.redirect('/backend')
//     } else {
//       res.redirect('/');
//     }
//   } catch (error) {
//     console.log(error);
//     res.redirect('/'); // Bei einem Fehler ebenfalls umleiten
//   }
// };

