const config = require('./config');
const accountSid = config.sid;
const authToken = config.authToken;
const myNumber = config.myNumber;
const client = require('twilio')(accountSid, authToken);

client.messages.create({
    to: '+16476365775',
    from: myNumber,
    body: 'better work'
}).then((message) => console.log(message.sid));