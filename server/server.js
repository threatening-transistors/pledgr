var express = require('express');
var mongoose = require('mongoose');

require('dotenv').load();

var app = express();

//set jwt-simple secret word
app.set('jwtTokenSecret', 'DeRaNiRa');

//connects mongoose to the 'pledgr' database;
//the 'pledgr' db is created automatically at connection

var mongoURI = process.env.MONGO_URI || 'mongodb://localhost/pledgr';

mongoose.connect(mongoURI);

module.exports = app;

require('./config/middleware')(app, express);
