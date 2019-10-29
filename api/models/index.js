const mongoose = require('mongoose');
const Logger = require('@logger')('DB');

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
if (!host) throw new Error("Missing env variable DB_HOST");
if (!port) throw new Error("Missing env variable DB_PORT");
if (!dbName) throw new Error("Missing env variable DB_NAME");

mongoose.connect(`mongodb://${host}:${port}/${dbName}`, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

require('./schemas/user');
require('./schemas/userSession');
require('./schemas/blacklist');
require('./schemas/session');

var db = mongoose.connection;
db.on('error', () => {
    Logger.error(`Database connection error`);
    console.error.bind(console, 'Connection error:')
});
db.once('open', function () {
    Logger.info(`Database MongoDb connected`);
});
