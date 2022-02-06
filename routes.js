const api = require('./controllers/api');
const game = require('./controllers/game');
module.exports = function(app) {
    app.get('/api/ping', api.ping);
    app.get('/api/players', api.getPlayers);
    app.get('/api/phrase', api.getPhrase);
    app.get('/api/send', api.sendSMS);
    app.get('/api/newGame', api.createGame);
    app.get('/api/joinGame', api.joinGame);
    app.get('/api/getGame', api.getGame);
    app.get('/api/startGame', api.startGame);
    app.get('/api/verify', api.verify);
    app.post('/api/receive', api.receive);
    app.get('/', game.index);
    app.get('/new', game.newGame);
    app.get('/join', game.joinGame);
    app.get('/lobby', game.lobby);
    app.get('/scoreboard', game.scoreboard);
}