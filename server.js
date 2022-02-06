const app = require('./app');
const port = process.argv[2] || 8080;
require('dotenv').config();

const server = app.listen(port, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`server listening to ${host}:${port}`);
});
