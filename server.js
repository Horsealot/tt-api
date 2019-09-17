'use strict';

require('dotenv').config();

const express = require('express');
const formData = require('express-form-data');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const routes = require('./api/routes');
const helmet = require('helmet');
const logger = require('./api/utils/logger');
const router = express.Router();

require('./api/utils/locale');

// Constants
const PORT = process.env.PORT || '8080';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Databases
require('./api/models');

// App
const app = express();

//Configure our app
app.use(cors());
app.use(helmet());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(formData.parse());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({ secret: 'brainsecret-token', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!IS_PRODUCTION) {
    app.use(errorHandler());
}

routes(router);
app.use('/api', router);

logger.info(`SERVER\tRunning on port ${PORT}`);
module.exports = app.listen(PORT);
