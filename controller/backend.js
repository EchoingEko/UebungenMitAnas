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

exports.backendEditUser = async function editUser(req, res) {
    try {
        const userId = req.params.id;
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
                <input type="password" id="password" name="password" value="${user.password}" required>
                <br>
                <button type="submit">Änderungen speichern</button>
            </form>
            <a href="/">Zurück zur Startseite</a>
        `);
    } catch (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error);
        res.status(500).send('Interner Serverfehler');
    };
};

exports.updateUser = async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const { username, password } = req.body;  // Hole die aktualisierten Daten aus dem Formular

        const user = await User.findByIdAndUpdate(userId, { 
            username: username, 
            password: password 
        });

        if (!user) {
            return res.status(404).send('Benutzer nicht gefunden');
        }

        res.redirect('/');  // Zurück zur Startseite nach erfolgreicher Bearbeitung
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
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

exports.backendLogout = async function userLogout(req, res) {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/');
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Benutzer:', error);
        res.status(500).send('Interner Serverfehler');
    }
}

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

// exports.backendTableHTML = async function listUser(req, res) {
//     const user = req.session.user || null;

//     if (user) {
//         try {

//             const users = await User.find();

//             let table = '<table><tr><th>ID</th><th>Username</th><th>Hashed Password</th></tr>';
//             users.forEach(user => {
//                 table += `<tr><td><a href="/edit/${user._id}" target="_blank">${user._id}</a></td><td>${user.username}</td><td>${user.password}</td></tr>`;
//             });
//             table += '</table>';

//             const userJSON = JSON.stringify(user);
//             res.send(`
//                     <!DOCTYPE html>
//                     <html lang="en">
//                     <head>
//                         <meta charset="UTF-8">
//                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                         <title>Startseite</title>
//                         <style>
//                         table {
//                             width: 50%;
//                             border-collapse: collapse;
//                         }
//                         table, th, td {
//                             border: 1px solid black;
//                         }
//                         th, td {
//                             padding: 8px;
//                             text-align: left;
//                         }
//                     </style>
//                     </head>
//                     <body>
    
//                     <div id="auth-links">
//                         <h1>Wilkommen auf der Startseite</h1>
//                         <a href="/addUser"><button>Add User</button></a>
//                         <a href="./logout">Logout</a>
//                         <p>Hallo, ${user.username}! Du bist eingeloggt.</p>
//                     </div>
    
//                     <div id="user-table">
//                         ${table}  <!-- Tabelle hier einfügen -->
//                     </div>
    
//                     </body>
//                     </html>
//                 `);
//         } catch (error) {
//             console.error('Fehler beim Abrufen der Benutzer:', error);
//             res.status(500).send('Interner Serverfehler');
//         }
//     } else {
//         res.send(`
//                 <!DOCTYPE html>
//                 <html lang="en">
//                 <head>
//                     <meta charset="UTF-8">
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                     <title>Startseite</title>
//                 </head>
//                 <body>
    
//                 <div id="auth-links">
//                     <h1>Wilkommen auf der Startseite</h1>
//                     <a href="./login">Login</a>
//                     <a href="./registrieren">Registrieren</a>
//                 </div>
    
//                 </body>
//                 </html>
//             `);
//     }
// };