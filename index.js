const express = require('express');
const router = require('./router');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/users')
.then(() => console.log('Mit MongoDB verbunden'))
.catch(err => console.log('Fehler bei der Verbindung zu MongoDB:', err));

app.use(express.json());

app.use('/', router);

app.listen(port, () => {
    console.log(`app listening on ${port}`);
});