const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  sid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  myNumber: process.env.MY_PHONE_NUMBER
};