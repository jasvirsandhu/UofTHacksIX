const phraseGenerator = require('./phraseGenerator');

class Game {
    constructor(id) {
        this.id = id;
        this.players = [];
        this.phrase = new phraseGenerator.Phrase();
    }

    addPlayer(player){
        this.players.push(player);
    }

    getGameId(){
        return this.id;
    }

    getPlayers(){
        return this.players;
    }

    getPhrase(){
        return this.phrase;
    }

    getScrambled(){
        return this.phrase.getScrambled();
    }
}

module.exports = {
    Game
}