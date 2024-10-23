const express = require('express');
const app = express();
const path = require('path');
const User = require('./models/user.js');
//const Transaction = require('./models/transaction.js')
const router = express.Router();
const backend = require('./controller/backend.js')
//const backend = require('./controllers/backend.js')

// app.set('web/views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// module.exports = function () {
router.get('/login', (req, res) => {
    res.render('login') //versuch mal mit render 
});

router.get('/registrieren', (req, res) => {
    res.render('registrieren');
});

router.get('/edit/:id', backend.backendEditUser);
router.post('/update/:id', backend.updateUser);
router.post('/login', backend.backendLogin);
router.post('/registrieren', backend.backendRegistration);
router.get('/logout', backend.backendLogout);
router.get('/', backend.tableEJS);

router.get('/addUser', (req, res) => {
    res.send("hallo neuer User");
});












// router.get('/backend', (req, res) => {
//     res.sendFile(path.join(__dirname, 'backend.html'));
// });

/*function (req, res) {*/
// router.post('/', async (req, res) => {
//backend.backendLogin(req, res);


//     const { username, password } = req.body;
//     console.log(username, password);
// const findAllUsers = await USER.find();
// console.log(findAllUsers);
//     const user = await USER.findOne({ username: username });
//     if (!user) {
//         console.log("1");
//         return res.status(400).send('Benutzer nicht gefunden');
//     }

//     if (password !== user.password) {
//         console.log("2");
//         return res.status(400).send('Ungültiges Passwort');
//     }

//     res.send('Erfolgreich eingeloggt');
//}); 


module.exports = router;
// };
