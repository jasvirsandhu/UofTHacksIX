const phraseGenerator = require('./phraseGenerator');

class Game {
    constructor(id) {
        this.id = id;
        this.players = [];
        this.phrase = new phraseGenerator.Phrase();
        this.status = 0;
    }

    addPlayer(player){
        this.players.push(player);
    }

    setStatus(status){
        this.status = 1;
    }

    getStatus(){
        return this.status;
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