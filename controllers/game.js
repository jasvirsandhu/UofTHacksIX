const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
const apiURL = 'http://localhost:8080/api';

function fetchAPI(url){
    console.log(url);
    fetch(url, {
        method: 'GET'
      }).then(response => {
        return response.text();
      }).catch(err => {console.log(err);});
}

module.exports = {
    index(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.sendFile('home.html', { root: path.join(__dirname, '../views') });
    },
    joinGame(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.sendFile('joinGame.html', { root: path.join(__dirname, '../views') });
    },
    newGame(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.sendFile('newGame.html', { root: path.join(__dirname, '../views') });
    },
    lobby(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.sendFile('playerBoard.html', { root: path.join(__dirname, '../views') });
    }
}