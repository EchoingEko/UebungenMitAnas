const User = require('../models/user.js');
const Transaction = require('../models/transactions.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

exports.backendLogin = async function (req, res) {

    const { username, password } = req.body;
    console.log(username, password);
    const findAllUsers = await User.find();
    console.log(findAllUsers);
    const user = await User.findOne({ username: username });
    if (!user) {
        console.log("1");
        return res.status(400).send('Benutzer nicht gefunden');
    }

    if (password !== user.password) {
        console.log("2");
        return res.status(400).send('Ungültiges Passwort');
    }

    res.send('Erfolgreich eingeloggt');
};


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

