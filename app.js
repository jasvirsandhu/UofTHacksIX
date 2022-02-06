const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static('./'));
app.use(bodyParser.urlencoded({extended: false}));
require('./routes')(app);

module.exports = app;