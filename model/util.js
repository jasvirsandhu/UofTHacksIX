const config = require('../config');
const accountSid = config.sid;
const authToken = config.authToken;
const myNumber = config.myNumber;
const client = require('twilio')(accountSid, authToken);
const phraseGenerator = require('./phraseGenerator');
const game = require('./game');

module.exports = {

    round(num){
        return Math.round(num * 100) / 100;
    },

    verify(phone, name) {
        console.log('verify');
        client.validationRequests
        .create({friendlyName: name, phoneNumber: phone})
        .then(validation_request => console.log('dd'+validation_request.friendlyName));
    },

    async sendMessage(msg, players) {
        const groupMessages = [];

        players.forEach(e => {
            groupMessages.push(
                {
                    name: e.name,
                    to: e.phone,
                    body: msg,
                    from: myNumber,
                }
            );

        });

        try {
            const results = await Promise.all(
                groupMessages.map((message) => client.messages.create(message))
            );
            console.log("success");
        } catch (error) {
            console.error(error);
        }
    },

    retrievePlayers() {
        const players = [
            {
                'name': 'Martin',
                'number': '+16476365775',
            }
        ];
        return players;
    },

    validId(id) {
        return id == 1;
    }
}