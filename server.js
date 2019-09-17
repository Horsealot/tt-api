'use strict';

require('dotenv').config();

const express = require('express');
const formData = require('express-form-data');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const helmet = require('helmet');
const logger = require('./api/utils/logger');

// Constants
const PORT = process.env.PORT || '8080';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// App
const app = express();

//Configure our app
app.use(cors());
app.use(helmet());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(formData.parse());

if(!IS_PRODUCTION) {
    app.use(errorHandler());
}

logger.info(`SERVER\tRunning on port ${PORT}`);
module.exports = app.listen(PORT);
