const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')
var config = require('./config');
var crypto = require('crypto');
const indexRoutes = require('./routes/index');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/dropbox', indexRoutes);

app.use('/', (req, res, next) => {
    res.send('You are on Root. Please <a href="/dropbox">Authorize</a> Dropbox');
})


app.use((req, res, next) => {
    res.status(404).send('<h1>Asta la vista baby!</h1>');
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))