const util = require('../model/util');
const phraseGenerator = require('../model/phraseGenerator');
const game = require('../model/game');

//global
//key is game id
const games = new Map();
//key is phone number
const players = new Map();
let gameId = 0;

module.exports = {
    ping(req, res) {
        const resBody = { 'success': true };
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.write(JSON.stringify(resBody));
        res.end();
    },
    getPlayers(req, res) {
        const id = req.query.id;
        res.setHeader('Content-Type', 'application/json');
        let resBody = { 'success': false };

        const intId = parseInt(id);

        if (!req.query.id || !games.has(intId)) {
            res.statusCode = 400;
            res.write(JSON.stringify(resBody));
            res.end();
            return;
        }

        //database call maybe for future scalability?
        playersObj = games.get(intId).getPlayers();

        res.statusCode = 200;
        res.write(JSON.stringify(playersObj));
        res.end();
    },
    createGame(req, res) {
        const name = req.query.name;
        const phone = '+1' + req.query.phone;
        res.setHeader('Content-Type', 'text/html');
        const player = { 'name': name, 'phone': phone, 'gameId': gameId, 'score': 0, 'guess': 0 };
        games.set(gameId, new game.Game(gameId));
        const currGame = games.get(gameId);
        currGame.addPlayer(player);
        players.set(phone, player);
        console.log(currGame);
        res.write(''+gameId);
        gameId++;
        res.end();
    },
    startGame(req, res){
        const id = req.query.id;
        const currGame = games.get(parseInt(id));
        const msg = 'Restore phrase: \n' + currGame.getScrambled();
        res.write(msg);
        util.sendMessage(msg, currGame.getPlayers());
        res.end();
    },
    joinGame(req, res) {
        const id = req.query.id;
        const name = req.query.name;
        const phone = '+1' + req.query.phone;

        const intId = parseInt(id);
        let currGame;
        if (games.has(intId)) {
            currGame = games.get(intId);
            const player = { 'name': name, 'phone': phone, 'gameId': intId, 'score': 0, 'guess': 0 };
            players.set(phone, player);
            currGame.addPlayer(player);
            console.log(currGame);
            res.statusCode = 200;
            res.write(''+intId);
        }
        else {
            res.statusCode = 400;
            res.write("cannot find game");
        }
        console.log(currGame);
        res.end();
    },
    sendSMS(req, res) {
        const msg = req.query.message || 'This man forgot to set the message lol!';
        console.log('sending');
        util.sendMessage(msg);
        res.end();
    },
    verify(req, res) {
        const phone = req.body.phone;
        const name = req.body.name;
        console.log(req.body);
        console.log(phone +' '+name);
        util.verify(phone, name);
        res.write('verify');
        res.end();
    },
    receive(req, res) {
        console.log(req.body);
        const phone = req.body.From;
        const msg = req.body.Body;
        let score = 0;

        if (players.has(phone)) {
            let gameResponse = '';
            //get the game
            const currGame = games.get(players.get(phone).gameId);
            //get phrase
            const phrase = currGame.getPhrase();
            console.log('player said: ' + msg);
            score = phrase.check(msg) * 100;
            //winner
            players.get(phone).guess = score;
            if (score == 100) {
                //make new phrase
                console.log('need new phrase');
                gameResponse = players.get(phone).name + ' restored the phrase!\nLEADERBOARD\n---\n';
                players.forEach (player => {
                    if (player.gameId == currGame.id){
                        player.score += player.guess;
                        gameResponse += player.name+': '+player.score+ ' (+'+player.guess+' ) \n';
                        player.guess = 0;
                    }
                });
                currGame.phrase = new phraseGenerator.Phrase();
                gameResponse += 'Restore phrase: \n' + currGame.getScrambled();
            }
            else {
                gameResponse = players.get(phone).name + ' got ' + util.round(score) + '% of the phrase correct.';
            }
            // res.send(`
            //     <Response>
            //         <Message>
            //             Response: ${gameResponse}
            //         </Message
            //     </Response
            // `);
            //res.end();
            util.sendMessage(gameResponse, currGame.players);
        }
    },
    getPhrase(req, res) {
        res.setHeader('Content-Type', 'application/json');
        // let resBody = { 
        //     'phrase': '',
        // };
        const phrase = new phraseGenerator.Phrase();
        phrase.setPhrase('Who should the dinosaur chase?');
        res.write(phrase + " " + phrase.check("  Who should      the dinosaur chase?????"));
        // res.write(phrase.getScrambled());
        console.log(JSON.stringify(phrase));
        res.end();
    }
}