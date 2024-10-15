const express = require('express');
const router = require('./router');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const morgan = require('morgan');
const session = require('express-session');

mongoose.connect('mongodb://localhost/users')
// mongoose.connect('mongodb://localhost:27017/users')
.then(() => console.log('Mit MongoDB verbunden'))
.catch(err => console.log('Fehler bei der Verbindung zu MongoDB:', err));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: '78XxxxxxxXXx Hal0-12,mnm,l',
    saveUninitialized: true,
    resave: false
  }));
app.set('view engine', 'html');

app.use('/', router);

app.listen(port, () => {
    console.log(`app listening on ${port}`);
});