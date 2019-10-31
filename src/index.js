"use strict";

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect('mongodb://link:game123@ds031721.mlab.com:31721/taskmanager', {useNewUrlParser: true});
mongoose.Promise = require('bluebird');


// require('./authenticate/auth')(app);

require('./chat/chat-socket')(io);
require('./boards/boards-socket')(io);
require('./items/boards-items-socket')(io);


http.listen(3000, () => {
	console.log('Server started on port 3000');
})